import Peer from "./Peer";
import { io } from "socket.io-client";
import { getPeerAuthToken } from "./db";

const globals = {
  email: localStorage.getItem("harmony_email"),
};

export default globals;

const socket = io(import.meta.env.VITE_SIGNALING_SERVER_ORIGIN, {
  auth: {
    token: localStorage.getItem("harmony_peer_token"),
  },
});

export const peer = new Peer({ socket });

peer.addEventListener("connectionError", (cb) => {
  getPeerAuthToken(cb);
});

peer.addEventListener("usersChanged", () => {
  if (
    peer.roomId &&
    !peer.myStreams.has("microphone") &&
    localStorage.getItem("harmony_microphone_id")
  ) {
    peer.startMicrophone(true, {
      audio: {
        deviceId: { exact: localStorage.getItem("harmony_microphone_id") },
      },
    });
  }
});
