import React, { useState, useRef, useEffect } from "react";
import { Send, SmilePlus, Paperclip } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

function Textarea({ placeholder, className, addMessage }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [text, setText] = useState("");
  const emojiPickerRef = useRef(null);

  const handleEmojiSelect = (emoji) => {
    setText(text + emoji.native);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  const sendMessage = async () => {
    if (!text) return;
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    const user = data.results[0];

    const currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    addMessage({
      name: `${user.name.first} ${user.name.last}`,
      message: text,
      time: formattedTime,
      avatar: user.picture.large,
    });
    setText("");
  };

  return (
    <div className="relative  flex flex-col chat-input-container border dark:border-white mx-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder={placeholder}
        className={`${className} w-full md:min-h-32 p-2 mb-10 bg-background  rounded-lg resize-none focus:outline-none pr-20`}
      />
      
      <div className="icons">
        <div className="absolute left-3 bottom-3 transform space-x-2 flex items-center">
          <div onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <SmilePlus size={24} />
          </div>
          <Paperclip size={24} />
        </div>
        <div className="absolute right-3 bottom-3 transform space-x-2 flex items-center">
          <Send size={24} onClick={sendMessage} />
        </div>
      </div>
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute left-3 bottom-14">
          <Picker data={data} theme="light" onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
}

export default Textarea;
