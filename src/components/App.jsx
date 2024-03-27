import { Outlet, useNavigate } from "react-router";
import { Link } from "react-router-dom";

import CallRequestAlert from "./CallRequestAlert";
import setTheme from "../utils/setTheme";
import ThemeSwitcher from "./ThemeSwitcher";
import Sidebar from "./Sidebar";
import { peer } from "../utils/globals";
import { useRef, useState } from "react";

function App() {
  const [callAlert, setCallAlert] = useState(null);
  const navigate = useNavigate()
  const audioRef = useRef(null);
  setTheme();
  peer.addEventListener(
    "callInvite",
    ({ socketId, username }, accept, decline) => {
      setCallAlert(
        <CallRequestAlert
          from={username}
          acceptFunction={() => {
            accept();
            navigate("video")
            setCallAlert(null);
          }}
          declineFunction={() => {
            decline();
            setCallAlert(null);
          }}
        ></CallRequestAlert>
      );
    }
  );
  peer.addEventListener("receivingChanged", () => {
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
  });
  return (
    <>
      <nav className="z-50 w-full bg-background sticky top-0 flex items-center px-3 justify-between group shadow-md dark:shadow-black">
        <div className="flex items-center gap-3">
          <Sidebar />
          <Link to="/" className="font-bold text-2xl">Harmony</Link>
        </div>
        <div>
          <div className="justify-self-end flex items-center w-6 h-6">
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
        {callAlert}
      </main>
      <audio ref={audioRef} autoPlay playsInline></audio>
    </>
  );
}
export default App;
