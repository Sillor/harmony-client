import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MicrophoneIcon from "../../components/icons/MicrophoneIcon";
import MicrophoneMuteIcon from "../../components/icons/MicrophoneMuteIcon";

import { ChevronDown, Medal } from "lucide-react";
import { useEffect, useState } from "react";
import { peer } from "../../utils/globals";

export default function MicrophoneButton({ muted, muteClicked }) {
  const [mediaDevices, setMediaDevices] = useState([]);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(
    localStorage.getItem("harmony_microphone_id")
  );
  const selectedIndex = mediaDevices.findIndex((device) => {
    return device.deviceId === selectedId;
  });

  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then((devices) => {
      setMediaDevices(
        devices.filter((a) => a.kind === "audioinput" && a.deviceId)
      );
    }) || [];
  }, []);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className={`flex flex-col relative justify-between items-center py-0.5 px-3 font-thin dark:hover:bg-primary-foreground w-16 ${
          muted && "text-red-400 hover:text-red-400"
        }`}
        onClick={muteClicked}
      >
        {muted ? (
          <MicrophoneMuteIcon className="w-5 h-5" />
        ) : (
          <MicrophoneIcon className="w-5 h-5" />
        )}
        <div className="text-xs">{muted ? "Unmute" : "Mute"}</div>
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="absolute top-0 right-0 bg-zinc-700 w-4 h-4 rounded-sm outline outline-primary dark:outline-secondary p-0">
            <ChevronDown className="text-white w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="border-input m-5">
          <Select
            onValueChange={(index) => {
              const device = mediaDevices[index];
              localStorage.setItem("harmony_microphone_id", device.deviceId);
              peer.stopMicrophone();
              peer.startMicrophone(peer.isMicrophoneMuted, {
                audio: { deviceId: { exact: device.deviceId } },
              });
            }}
            {...(selectedIndex !== -1 ? { defaultValue: selectedIndex } : {})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Microphone" />
            </SelectTrigger>
            <SelectContent className="border-input">
              <SelectGroup>
                <SelectLabel>Microphones</SelectLabel>
                {mediaDevices.map((device, i) => {
                  return (
                    <SelectItem key={i} value={i}>
                      {device.label || "Microphone " + (i + 1)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </PopoverContent>
      </Popover>
    </div>
  );
}
