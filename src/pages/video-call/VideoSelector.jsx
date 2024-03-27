import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import isMobileDevice from "../../utils/isMobileDevice.js";
import { peer } from "../../utils/globals.js";

export default function VideoSelector({ triggerButton, onStream }) {
  const [mediaDevices, setMediaDevices] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [streams, setStreams] = useState(getStreams());
  const hasPermission = "mediaDevices" in navigator;

  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then((devices) => {
      setMediaDevices(
        devices.filter((a) => a.kind === "videoinput" && a.deviceId)
      );
    }) || [];
  }, []);

  function getStreams() {
    return {
      myStream: true,
      display: peer.myStreams.has("screen"),
      camera: peer.myStreams.has("camera"),
    };
  }

  function handleSelectDisplayClick() {
    if (peer.myStreams.has("screen")) {
      peer.stopScreen();
      setStreams(getStreams());
      if (typeof onStream === "function") onStream();
      return;
    }

    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => {
          track.addEventListener("ended", () => {
            peer.stopScreen();
            setStreams(getStreams());
            if (typeof onStream === "function") onStream();
          });
        });
        peer.startScreen(stream);
        setStreams(getStreams());
        if (typeof onStream === "function") onStream();
      })
      .catch(() => {});
  }

  function handleSelectCameraClick() {
    if (streams.camera) {
      peer.stopCamera();
      setStreams(getStreams());
      if (typeof onStream === "function") onStream();
      return;
    }
    navigator.mediaDevices
      .getUserMedia({
        video:
          selectedCamera === "default"
            ? true
            : selectedCamera === "front"
            ? { facingMode: { ideal: "user" } }
            : selectedCamera === "rear"
            ? { facingMode: { ideal: "environment" } }
            : { deviceId: { exact: mediaDevices[selectedCamera].deviceId } },
      })
      .then((stream) => {
        stream.getTracks().forEach((track) => {
          track.addEventListener("ended", () => {
            peer.stopCamera();
            setStreams(getStreams());
            if (typeof onStream === "function") onStream();
          });
        });
        peer.startCamera(stream);
        setStreams(getStreams());
        if (typeof onStream === "function") onStream();
      })
      .catch(() => {});
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-auto h-auto border-input m-5">
        <div className="flex gap-5">
          {!isMobileDevice() && (
            <>
              <div className="flex items-center">
                <Button
                  disabled={!hasPermission || !peer.roomId}
                  className={`${streams.display && "text-red-600"}`}
                  onClick={handleSelectDisplayClick}
                >
                  {streams.display ? "Stop Display" : "Select Display"}
                </Button>
              </div>
              <div className="h-auto flex flex-col justify-center items-center">
                <Separator orientation="vertical" className="h-2/5 w-[2px]" />
                <span
                  className={`text-zinc-600 ${
                    !hasPermission && "!text-red-300"
                  }`}
                >
                  {hasPermission ? "or" : ""}
                </span>
                <Separator orientation="vertical" className="h-2/5 w-[2px]" />
              </div>
            </>
          )}
          <div className="flex flex-col items-center">
            <Select
              onValueChange={(value) => {
                setSelectedCamera(value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Camera" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Cameras</SelectLabel>
                  {!isMobileDevice() ? (
                    <>
                      <SelectItem value="default">Default</SelectItem>
                      {mediaDevices.map((device, i) => {
                        return (
                          <SelectItem key={i} value={i}>
                            {device.label || "Camera " + (i + 1)}
                          </SelectItem>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <SelectItem value="front">Front</SelectItem>
                      <SelectItem value="rear">Rear</SelectItem>
                    </>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              disabled={
                !hasPermission || selectedCamera === null || !peer.roomId
              }
              className={`mt-5 ${streams.camera && "text-red-600"}`}
              onClick={handleSelectCameraClick}
            >
              {streams.camera ? "Stop Camera" : "Start Camera"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
