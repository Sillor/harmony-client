import { useState } from "react";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import CameraIcon from "../components/icons/CameraIcon";
import MicrophoneIcon from "../components/icons/MicrophoneIcon";
import MicrophoneMuteIcon from "../components/icons/MicrophoneMuteIcon";
import { Button } from "@/components/ui/button";
import VideoSelector from "../components/VideoSelector";
import VideoStream from "../components/VideoStream";
import CallTesting from "../components/CallTesting";
import { peer } from "../utils/globals";
import stringToHexColor from "../utils/stringToHexColor";
export default function VideoChat() {
  const [members, setMembers] = useState(peer.members);
  const [muted, setMuted] = useState(peer.isMicrophoneMuted);
  const [imStreaming, setImStreaming] = useState(false);
  const [streams, setStreams] = useState({});
  const [spotlight, setSpotlight] = useState(null);

  const users = peer.roomId
    ? members.groups[peer.roomId]?.map((sid) => {
        const { username } = members.users[sid];
        return {
          uid: sid,
          name: username,
          type: "normal",
          color: stringToHexColor(sid),
        };
      }) || []
    : [];

  peer.addEventListener("usersChanged", (data) => {
    setMembers(data);
  });

  peer.addEventListener("receivingChanged", () => {
    const streams = Object.entries(peer.streams).reduce(
      (prev, [socketId, streams]) => {
        const display = streams["screen"];
        const camera = streams["camera"];
        if (!display && !camera) return prev;
        prev[socketId] = {
          display: streams["screen"] || null,
          camera: streams["camera"] || null,
        };
        return prev;
      },
      {}
    );
    const display = peer.myStreams.get("screen");
    const camera = peer.myStreams.get("camera");
    if (display || camera) {
      streams[peer.socketId] = {
        display,
        camera,
      };
    }
    setStreams(streams);
  });

  const streamTiles = Object.entries(streams).reduce(
    (prev, [username, { display, camera }], i) => {
      const element = (
        <VideoStream
          key={"video_" + i}
          displayStream={display}
          cameraStream={camera}
          className="aspect-video w-56 rounded-lg"
          onClick={() => {
            setSpotlight((prev) => {
              return prev && prev.type == "stream" && prev.uid == username
                ? null
                : { type: "stream", uid: username };
            });
          }}
          muted
        />
      );
      return { ...prev, [username]: element };
    },
    {}
  );
  const userTiles = users.reduce((prev, user, i) => {
    const element = (
      <div
        key={"user_" + i}
        className="aspect-video flex w-56 rounded-lg justify-center items-center"
        style={{ backgroundColor: user.color }}
        onClick={() => {
          setSpotlight((prev) => {
            return prev && prev.type == "user" && prev.uid == user.uid
              ? null
              : { type: "user", uid: user.uid };
          });
        }}
      >
        <div className="w-20 h-20 bg-white opacity-50 rounded-full flex items-center justify-center text-black text-2xl">
          {user.color.slice(1, 3).toUpperCase()}
        </div>
      </div>
    );
    return { ...prev, [user.uid]: element };
  }, {});

  function handleMuteClick() {
    peer.muteMicrophone(!muted);
    setMuted((prev) => peer.isMicrophoneMuted);
  }

  function handleVideoStartClick() {}

  function handleOnStream() {
    setStreams((prev) => {
      if (!imStreaming) setImStreaming(true);
      const camera = peer.myStreams.get("camera");
      const display = peer.myStreams.get("screen");
      if (!camera && !display) {
        const { [peer.socketId]: _, ...rest } = prev;
        setImStreaming(false);
        return rest;
      }
      return {
        ...prev,
        [peer.socketId]: {
          display,
          camera,
        },
      };
    });
  }

  return (
    <div className="w-full h-full flex-grow flex flex-col gap-5 mb-24">
      <CallTesting />
      <div className="w-full flex flex-col items-center px-10 group [&>*]:w-[clamp(200px,100%,calc(70vh*(16/9)+12rem))]">
        {spotlight !== null &&
          (spotlight.type === "stream"
            ? streamTiles[spotlight.uid]
            : userTiles[spotlight.uid])}
      </div>
      <div className="flex flex-grow w-full px-5 items-center justify-center">
        <div className="flex flex-wrap justify-center gap-3">
          {peer.roomId
            ? [...Object.values(streamTiles), ...Object.values(userTiles)]
            : "Not In Room"}
        </div>
      </div>
      <div
        className={`bg-secondary-foreground dark:bg-secondary fixed w-full bottom-0 flex flex-col text-white`}
      >
        <div className="flex justify-between items-center px-8 w-full grow min-h-12 max-h-12">
          <div className="flex gap-4 sm:w-1/3">
            <Button
              variant="ghost"
              className={`flex flex-col justify-between items-center py-0.5 px-3 font-thin dark:hover:bg-primary-foreground w-16 ${
                muted && "text-red-400 hover:text-red-400"
              }`}
              onClick={handleMuteClick}
            >
              {muted ? (
                <MicrophoneMuteIcon className="w-5 h-5" />
              ) : (
                <MicrophoneIcon className="w-5 h-5" />
              )}
              <div className="text-xs">{muted ? "Unmute" : "Mute"}</div>
            </Button>
            <VideoSelector
              onStream={handleOnStream}
              triggerButton={
                <Button
                  variant="ghost"
                  className={`flex flex-col justify-between items-center py-0.5 px-3 font-thin dark:hover:bg-primary-foreground ${
                    streams[peer.socketId] &&
                    "text-green-400 hover:text-green-400"
                  }`}
                  onClick={handleVideoStartClick}
                >
                  <CameraIcon className="w-5 h-5" />
                  <div className={`text-xs`}>
                    {imStreaming ? "Streaming" : "Start Video"}
                  </div>
                </Button>
              }
            />
          </div>
          <div className="flex w-1/3 justify-center">
            <Button
              variant="ghost"
              className="flex flex-col justify-between items-center py-0.5 px-3 font-thin dark:hover:bg-primary-foreground"
            >
              <ChatBubbleIcon className="w-5 h-5" />
              <div className="text-xs">Chat</div>
            </Button>
          </div>
          <div className="flex w-1/3 justify-end">
            <Button
              className="h-7 bg-primary-foreground text-primary hover:bg-zinc-300 dark:bg-primary dark:text-primary-foreground dark:hover:bg-zinc-300"
              onClick={() => {
                peer.leaveRoom();
              }}
            >
              Leave
            </Button>
          </div>
        </div>
        {navigator.standalone && <div className="h-4"></div>}
      </div>
    </div>
  );
}
