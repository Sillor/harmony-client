import React, { useEffect, useState } from "react";
import AvailableRooms from "./AvailableRooms";
import { peer } from "../../utils/globals";
import VideoCall from "./VideoCall";

export default function VideoCallPage() {
  const [members, setMembers] = useState(peer.members);
  const [currentRoom, setCurrentRoom] = useState(peer.roomId);

  useEffect(() => {
    peer.addEventListener("usersChanged", () => {
      setMembers(peer.members);
      setCurrentRoom(peer.roomId);
    });
  }, []);

  return (
    <>{currentRoom ? <VideoCall /> : <AvailableRooms members={members} />}</>
  );
}
