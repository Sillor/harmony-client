import React, { createContext } from "react";
import Peer from "./Peer";
import { io } from "socket.io-client";

const globals = {
  email: localStorage.getItem("harmony_email"),
  authToken: localStorage.getItem("token"),
  teamsCache: {},
};
let connectionAttempts = 0;

export default globals;

/** @type {{teamNotifications: {}, setTeamNotifications: React.Dispatch<React.SetStateAction<{}>>}} */
export const AppContext = createContext({})

export const socket = io(import.meta.env.MODE === "production" ? import.meta.env.VITE_SERVER_ORIGIN : import.meta.env.VITE_SIGNALING_SERVER_ORIGIN, {
  auth: {
    token: globals.authToken,
  }
})

socket.on("connect_error", (err) => {
  if (err.message === "xhr poll error") {
    if (connectionAttempts >= 5) {
      connectionAttempts++;
      socket.close();
      console.error("Socket connection failed, socket closed. Refresh page to try again");
    }
    connectionAttempts++;
  }
});


/**
 * Used to set the value of `globals.teamsCache` using the response from `loadTeams()` in `teamsHandler.js`
 * @typedef {{uid: string, name: string, owned: boolean, teamCallLink: string}} TeamData
 * @param {TeamData[]} teams
 * @returns {{[teamUid: string]: TeamData}}
 */
export function cacheTeams(teams) {
  const obj = teams.reduce((prev, curr) => {
    prev[curr.uid] = curr;
    return prev;
  }, {});
  globals.teamsCache = obj;
  return obj;
}

export const peer = new Peer({ socket });

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