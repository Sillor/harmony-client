import React, { useState, useEffect, useRef } from 'react';
import { Phone, Calendar, UserRoundPlus } from 'lucide-react';
import DashboardCalendar from './DashboardCalendar'
import GroupMembers from './GroupMembers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import './GroupDashboard.css';
import { Send, SmilePlus, Paperclip } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

function Message({ name, message, time, avatar }) {
  // Split the message by newline characters and map each line to a JSX element
  const messageLines = message.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className="message border border-input rounded-md flex p-2 mb-2">
      <img
        src={avatar || 'https://via.placeholder.com/40'}
        alt=""
        className="rounded-full w-10 h-10 object-cover me-4 flex-shrink-0 cursor-pointer"
      />
      <div className="message-body">
        <h1 className="font-semibold text-sm me-auto">{name}</h1>
        <p className="text-sm">{messageLines}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

function Textarea({ placeholder, className, addMessage }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [text, setText] = useState('');
  const emojiPickerRef = useRef(null);

  const handleEmojiSelect = (emoji) => {
    setText(text + emoji.native);
    setShowEmojiPicker(false)
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
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emojiPickerRef]);

  const sendMessage = async () => {
    if (!text) return;
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    const user = data.results[0];

    const currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    addMessage({
      name: `${user.name.first} ${user.name.last}`,
      message: text,
      time: formattedTime,
      avatar: user.picture.large,
    });
    setText('');
  };

  return (
    <div className="relative w-full flex flex-col">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder={placeholder}
        className={`${className} w-full min-h-32 p-2 bg-background border border-input rounded-lg resize-none focus:outline-none focus:border-primary transition-all duration-200 ease-in-out pr-20`}
      />
      <div className="icons">
        <div className="absolute left-3 bottom-3 transform space-x-2 flex items-center">
          <div className='cursor-pointer' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <SmilePlus size={24} />
          </div >
          <Paperclip className='cursor-pointer' size={24} />
        </div>
        <div className="absolute right-3 bottom-3 transform space-x-2 flex items-center">
          <Send size={24} className='cursor-pointer' onClick={sendMessage} />
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

function DashboardMessages({date, setDate, messages, setMessages, groupName}) {
      const addMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

    return (
        
        <div className="chat xl:me-3 w-full h-full flex flex-col">
          <div className="chatbox border border-input rounded-lg px-4 xl:px-8 py-6 gap-4 mb-3 grow flex flex-col">
            <div className="chatbox--header flex items-center">
                <h1 className="font-semibold text-xl sm:text-2xl xl:text-3xl me-auto">
                  <GroupMembers groupName={groupName} />
                </h1>
              <div className="icons flex gap-4 p-3">
                <Phone size={24} className='cursor-pointer' />
                <UserRoundPlus className='cursor-pointer' size={24} />
                <Dialog>
                  <DialogTrigger>
                    <Calendar size={24} className="xl:hidden cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="w-fit p-12 max-h-[80vh] overflow-y-auto xl:hidden">
                    <div className='block xl:hidden'><DashboardCalendar groupName={groupName} date={date} setDate={setDate} /></div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="chat-messages overflow-y-auto h-[50vh] custom-scrollbar grow">
              {messages.map((message, index) => (
                <Message
                  key={index}
                  name={message.name}
                  message={message.message}
                  time={message.time}
                  avatar={message.avatar}
                />
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Type your message here."
            className="resize-none"
            addMessage={addMessage}
          />
        </div>
    );
}

export default DashboardMessages;






