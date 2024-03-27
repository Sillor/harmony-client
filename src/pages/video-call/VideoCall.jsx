import { useEffect, useState } from "react";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import CameraIcon from "../../components/icons/CameraIcon";

import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoSelector from "./VideoSelector";
import VideoStream from "../../components/VideoStream";
import { peer } from "../../utils/globals";
import stringToHexColor from "../../utils/stringToHexColor";
import MicrophoneButton from "./MicrophoneButton";
import DashboardMessages from "../group-dashboard/DashboardMessages";
import FileManagement from "../file-management/FileManagement";
import "./VideoCall.css";

export default function VideoCall() {
  const [members, setMembers] = useState(peer.members);
  const [muted, setMuted] = useState(peer.isMicrophoneMuted);
  const [imStreaming, setImStreaming] = useState(false);
  const [streams, setStreams] = useState(getStreams());
  const [spotlight, setSpotlight] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTab, setChatTab] = useState("chat");
  const [width, setWidth] = useState(window.innerWidth);
  const [groupName, setGroupName] = useState("test-group");
  const [date, setDate] = useState(new Date().toISOString());
  const [messages, setMessages] = useState([]);

  const chatSwitchWidth = 639;

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

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });

    peer.addEventListener("usersChanged", (data) => {
      setMembers(data);
    });

    peer.addEventListener("receivingChanged", () => {
      setStreams(getStreams());
    });
  }, []);

  function getStreams() {
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
    return streams;
  }

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

  const callMembers = (
    <>
      <div className="w-full h-full flex-grow flex flex-col">
        <div className="w-full flex flex-col items-center px-10 group mt-5 [&>*]:w-[clamp(200px,100%,calc(70vh*(16/9)+12rem))]">
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
      </div>
    </>
  );

  const chatComponent = (
    <div className="p-2 h-full sm:ps-0 video-call--chat-tabs">
      <Tabs
        defaultValue={chatTab}
        onValueChange={setChatTab}
        className="h-full flex flex-col"
      >
        <TabsList className="self-start">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="grow">
          <DashboardMessages
            date={date}
            setDate={setDate}
            groupName={groupName}
            setGroupName={setGroupName}
            messages={messages}
            setMessages={setMessages}
          />
        </TabsContent>
        <TabsContent value="files" className="grow overflow-auto">
          <FileManagement />
        </TabsContent>
      </Tabs>
    </div>
  );

  const chatButton = (
    <Button
      variant="ghost"
      className="flex flex-col justify-between items-center py-0.5 px-3 font-thin dark:hover:bg-primary-foreground"
      onClick={() => {
        setChatOpen((prev) => !prev);
      }}
    >
      <ChatBubbleIcon className="w-5 h-5" />
      <div className="text-xs">Chat</div>
    </Button>
  );

  const sheetChat = (
    <>
      <Sheet defaultOpen={chatOpen} onOpenChange={setChatOpen}>
        <SheetTrigger asChild>{chatButton}</SheetTrigger>
        <SheetContent
          className="border-input p-0"
          onClose={() => setChatOpen(false)}
        >
          {chatComponent}
        </SheetContent>
      </Sheet>
    </>
  );

  const callComponent = (
    <>
      <div className="w-full h-full flex-grow flex flex-col" data-no-padding>
        {callMembers}
        <div
          className={`bg-secondary-foreground dark:bg-secondary text-white rounded-t-lg`}
        >
          <div className="flex justify-between items-center px-3 w-full min-h-12 max-h-12 h-12">
            <div className="flex gap-2 sm:gap-4 sm:flex-1">
              <MicrophoneButton muted={muted} muteClicked={handleMuteClick} />
              <VideoSelector
                onStream={handleOnStream}
                triggerButton={
                  <Button
                    variant="ghost"
                    className={`flex flex-col justify-between items-center py-0.5 font-thin dark:hover:bg-primary-foreground ${
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
            <div className="flex flex-1 justify-center">
              {width > chatSwitchWidth ? chatButton : sheetChat}
            </div>
            <div className="flex flex-1 justify-end">
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
    </>
  );

  const resizeChat = (
    <ResizablePanelGroup
      data-no-padding
      direction="horizontal"
      className="w-full h-[100svh] flex-grow flex flex-col gap-1"
    >
      <ResizablePanel minSize={(300 / width) * 100} className="">
        {callComponent}
      </ResizablePanel>
      <ResizableHandle className="bg-transparent" />
      <ResizablePanel
        defaultSize={(340 / width) * 100}
        minSize={(340 / width) * 100}
      >
        <div className="h-full">{chatComponent}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  return (
    <>{chatOpen && width > chatSwitchWidth ? resizeChat : callComponent}</>
  );
}
