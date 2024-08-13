import React, { useState, useEffect, useContext, useRef } from "react";
import DashboardCalendar from "./DashboardCalendar";
import DashboardMessages from "./DashboardMessages";
import GroupMembers from "./GroupMembers";
import "./GroupDashboard.css";
import { DateTime } from "luxon";
import { useNavigate, useParams } from "react-router-dom";
import { loadChat } from "../../utils/chatHandler";
import { loadTeams } from "../../utils/teamsHandler";
import globals, { socket } from "../../utils/globals";

function GroupDashboard() {
  const { group, uid } = useParams();
  const navigate = useNavigate();

  const [groupName, setGroupName] = React.useState(null);

  const today = DateTime.local().toISODate();

  const [date, setDate] = React.useState(today);
  // console.log('date var:', date);

  const [messages, setMessages] = useState([]);

  /** @type {{current: undefined | HTMLElement}} */
  const messagesContainer = useRef(null)

  const [atBottom, setAtBottom] = useState(null)

  useEffect(() => {
    loadTeams()
      .then((data) => {
        data.data.forEach((team) => (globals.teamsCache[team.uid] = team));
        return data.data.find((team) => team.uid === uid);
      })
      .then((team) => {
        if (team.name.toLowerCase().replaceAll(" ", "-") !== group) {
          navigate("/");
          return;
        }
        setGroupName(team.name);
      })
      .catch((error) => {
        console.error("error occurred while loading team chat");
        navigate("/");
      });
  }, []);

  useEffect(()=>{
  }, [groupName])

  useEffect(()=>{
    const el = messagesContainer.current
    if (el && atBottom === null) {
      el.scrollTo(0,el.scrollHeight)
      setAtBottom(true)
    } else if (el && atBottom) {
      setTimeout(()=>{
        el.scrollTo({behavior: "smooth", top: el.scrollHeight})
      },100)
    }
  }, [messages])

  useEffect(() => {
    function updateMessages() {
      if (!groupName) return
      return loadChat({ teamName: groupName, teamUid: uid }).then((data) => {
        if (!data.success) return;
        setMessages(data.data);
      });
    }
  
    async function getData() {
      await updateMessages()
    }

    if (!atBottom) getData()

    socket.on("update:new_message", updateMessages);
    socket.on("update:edited_message", updateMessages)
    socket.on("update:deleted_message", updateMessages)
    
    return () => {
      socket.off("update:new_message", updateMessages);
      socket.off("update:edited_message", updateMessages)
      socket.off("update:deleted_message", updateMessages)
    };
  }, [groupName]);

  

  function onMessagesScroll(event) {
    const el = event.target
    setAtBottom(el.scrollTop + el.clientHeight === el.scrollHeight)
  }

  return (
    <div className="md:w-3/4 xl:w-7/12 flex justify-center px-2">
      {groupName && 
      <div className="content-body flex w-full">
        <DashboardMessages
          date={date}
          setDate={setDate}
          messages={messages}
          setMessages={setMessages}
          groupName={groupName}
          setGroupName={setGroupName}
          messagesContainer={messagesContainer}
          onMessagesScroll={onMessagesScroll}
        />
        <div className="hidden xl:block">
          <DashboardCalendar
            date={date}
            setDate={setDate}
            groupName={groupName}
          />
        </div>
      </div>
      }
    </div>
  );
}

export default GroupDashboard;
