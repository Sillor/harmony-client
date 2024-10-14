import { createContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import CallRequestAlert from "./CallRequestAlert";
import Navbar from "./Navbar";
import setTheme from "../utils/setTheme";
import globals, { peer, socket, AppContext } from "../utils/globals";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [callAlert, setCallAlert] = useState(null);
  const [teamNotifications, setTeamNotifications] = useState({});
  const [teamUpdated, setTeamUpdated] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const audioRef = useRef(null);
  const { toast } = useToast();
 
  setTheme();

  useLayoutEffect(() => {
    async function handleOAuthFetch(){
      try{
      const fetchGoogleUser = await fetch('http://localhost:5000/api/auth/google/session-info', {
        credentials: "include",
      })
      const userData = await fetchGoogleUser.json()
      
      console.log("handleoauthfetch", userData)
        localStorage.setItem("harmony_email", userData.user.email)
        navigate('/')
        return 
      } catch(error) {
        console.log("nothing to fetch")
        return 
      } 
    }
    handleOAuthFetch()
    return 

  }, [])
  
  useEffect(() => {
    const [, group, , uid] = location.pathname.split("/");
    if (group === "group" && teamNotifications[uid]) {
      setTeamNotifications((prev) => {
        const obj = { ...prev };
        const val = obj[uid];
        obj[uid] = val === null ? -1 : val > 0 ? null : val - 1;
        return obj;
      });
    }
  }, [location]);

  useEffect(() => {
    const path = location.pathname.split("/").slice(1);
    function onNewMessage({ team }) {
      setTeamNotifications((prev) => {
        const obj = { ...prev };
        obj[team] ??= 0;
        obj[team]++;
        return obj;
      });
      setTeamUpdated((prev) => {
        const obj = { [team]: (prev[team] || 0) + 1 };
        return obj;
      });
    }

    function onEditedMessage({ team }) {
      setTeamUpdated((prev) => {
        const obj = { [team]: (prev[team] || 0) + 1 };
        return obj;
      });
    }

    function onDeletedMessage({ team }) {
      setTeamUpdated((prev) => {
        const obj = { [team]: (prev[team] || 0) + 1 };
        return obj;
      });
    }

    function onFriendRequestReceived({ username }) {
      toast({
        title: "Friend Request Received",
        description: `${username} has sent you a friend request`,
        className: "px-3 py-1",
      });
    }

    function onTeamRequestReceived({ team }) {
      toast({
        title: "Team Request Received",
        description: `'${team}' has invited you to join`,
        className: "px-3 py-1",
      });
    }

    function onCallInvite({ socketId, username }, accept, decline) {
      setCallAlert(
        <CallRequestAlert
          from={username}
          acceptFunction={() => {
            accept();
            navigate("video");
            setCallAlert(null);
          }}
          declineFunction={() => {
            decline();
            setCallAlert(null);
          }}
        ></CallRequestAlert>
      );
    }

    function onReceivingChanged() {
      const audio = new MediaStream();
      for (const socketId in peer.streams) {
        const streams = peer.streams[socketId];
        if ("microphone" in streams) {
          streams["microphone"].getAudioTracks().forEach((track) => {
            audio.addTrack(track);
          });
        }
      }

      if (audioRef.current) {
        audioRef.current.srcObject = audio;
      }
    }

    function onFileAdded({ team, filename, user }) {
      if (path[0] === "files" && path[1] === team) return;
      toast({
        title: "File Added",
        description: `${user} added '${filename}' to ${
          globals.teamsCache[team]?.name || "?"
        }`,
        className: "px-3 py-1",
      });
    }

    function onFileRemoved({ team, filename, user }) {
      if (path[0] === "files" && path[1] === team) return;
      toast({
        title: "File Removed",
        description: `${user} removed '${filename}' from ${
          globals.teamsCache[team]?.name || "?"
        }`,
        className: "px-3 py-1",
      });
    }

    peer.addEventListener("callInvite", onCallInvite);
    peer.addEventListener("receivingChanged", onReceivingChanged);
    socket.on("update:new_message", onNewMessage);
    socket.on("update:edited_message", onEditedMessage);
    socket.on("update:deleted_message", onDeletedMessage);
    socket.on("update:file_added", onFileAdded);
    socket.on("update:file_removed", onFileRemoved);
    socket.on("update:new_friend_request", onFriendRequestReceived);
    socket.on("update:new_team_request", onTeamRequestReceived);
    
    return () => {
      peer.removeEventListener("callInvite", onCallInvite);
      peer.removeEventListener("receivingChanged", onReceivingChanged);
      socket.off("update:new_message", onNewMessage);
      socket.off("update:edited_message", onEditedMessage);
      socket.off("update:deleted_message", onDeletedMessage);
      socket.off("update:file_added", onFileAdded);
      socket.off("update:file_removed", onFileRemoved);
      socket.off("update:new_friend_request", onFriendRequestReceived);
      socket.off("update:new_team_request", onTeamRequestReceived);
    };
  }, [location]);
  return (
    <AppContext.Provider
      value={{ teamNotifications, setTeamNotifications, teamUpdated }}
    >
      <Navbar />
      <main>
        <Outlet />
        {callAlert}
      </main>
      <Toaster />
      <audio ref={audioRef} autoPlay playsInline></audio>
    </AppContext.Provider>
  );
}
export default App;
