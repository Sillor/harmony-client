import React, { useState } from "react";
import FriendInvites from "./FriendInvites";
import Teams from "./Teams";
import Event from "./Event";
import { Calendar } from "lucide-react";
import { Calendar as CustomCalendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import "./PersonalDashboard.css";
import TeamInvites from "./TeamInvites";
import CreateTeamDialog from "./CreateTeamDialog";
import ChatCanvas from "../../components/chatcanvas/ChatCanvas";
import ChatBox from "../../components/chatcanvas/ChatBox";

function PersonalDashboard() {
  const [date, setDate] = React.useState(new Date());
  const [individualChatOpen, setindividualChatOpen] = useState(false);
  const [chatListOpen, setChatListOpen] = useState(false);
  const [friendInvites, setFriendInvites] = useState([
    {
      name: "Bob Johnson",
      avatar: "assets\\img\\pexels-justin-shaifer-1222271.jpg",
    },
    {
      name: "Alice Smith",
      avatar: "assets\\img\\pexels-andrea-piacquadio-774909.jpg",
    },
    {
      name: "Charlie Brown",
      avatar: "assets\\img\\pexels-nitin-khajotia-1516680.jpg",
    },
    {
      name: "Bob Johnson",
      avatar: "assets\\img\\pexels-justin-shaifer-1222271.jpg",
    },
    {
      name: "Alice Smith",
      avatar: "assets\\img\\pexels-andrea-piacquadio-774909.jpg",
    },
    {
      name: "Charlie Brown",
      avatar: "assets\\img\\pexels-nitin-khajotia-1516680.jpg",
    },
    {
      name: "Alice Smith",
      avatar: "assets\\img\\pexels-andrea-piacquadio-774909.jpg",
    },
    {
      name: "Charlie Brown",
      avatar: "assets\\img\\pexels-nitin-khajotia-1516680.jpg",
    },
  ]);

  const [teamInvites, setTeamInvites] = useState([
    {
      name: "DIY Facial Reconstruction",
    },
    {
      name: "Risk-Averse Plastic Surgeons",
    },
    {
      name: "Forgetful dentists",
    },
  ]);

  const [teams, setTeams] = useState([
    {
      name: "Bob Johnson",
    },
    {
      name: "Alice Smith",
    },
    {
      name: "Charlie Brown",
    },
  ]);

  const events = [
    {
      name: "Meeting",
      time: "10:00 AM",
    },
    {
      name: "Bob’s Reminder",
      time: "11:30 AM",
    },
    {
      name: "Lunch Break",
      time: "1:00 PM",
    },
    {
      name: "Brainstorming Session",
      time: "2:30 PM",
    },
    {
      name: "Charlie’s DIY Dentistry Workshop",
      time: "5:30 PM",
    },
  ];

  return (
    <>
      <div className="flex justify-center h-screen md:w-5/6 xl:w-10/12">
        <div className="w-screen flex justify-center px-2 lg:mr-32">
          <div className="content-body flex w-full">
            <div className="chat xl:me-3 w-full h-5/6 flex flex-col">
              <div className="chatbox border border-input rounded-lg px-4 xl:px-8 py-6 gap-4 mb-3 overflow-y-auto">
                <div className="chatbox--header flex items-center mb-4">
                  <h1 className="font-semibold text-xl mb-3 sm:text-2xl xl:text-3xl me-auto">
                    My Teams
                  </h1>
                  <div className="icons flex gap-4 ">
                    <CreateTeamDialog />

                    <Dialog>
                      <DialogTrigger>
                        <Calendar size={24} className="xl:hidden" />
                      </DialogTrigger>
                      <DialogContent className="w-fit md:p-12 rounded-md max-h-[80vh] overflow-y-auto">
                        <CustomCalendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-md border border-input h-fit mb-3"
                        />
                        <div className="day-breakdown rounded-md border border-input p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h1 className="font-semibold text-3xl">Today</h1>
                            <button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-1 px-4 rounded">
                              Add
                            </button>
                          </div>
                          <div className="events">
                            <Event name="Meeting" time="10:00 AM" />
                            <Event name="Bob’s Reminder" time="11:30 AM" />
                            <Event name="Lunch Break" time="1:00 PM" />
                            <Event
                              name="Brainstorming Session"
                              time="2:30 PM"
                            />
                            <Event
                              name="Charlie’s DIY Dentistry Workshop"
                              time="5:30 PM"
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="chat-messages overflow-y-auto h-[50vh] custom-scrollbar">
                  {teams.map((team, index) => (
                    <Teams key={index} name={team.name} />
                  ))}
                </div>
              </div>

              <div className="friend-team-invites flex-1 flex flex-col md:flex-row h-1/3">
                <div className="friend-invites rounded-md border border-input p-4 md:mr-2 md:flex-1 overflow-y-auto mb-3 h-1/2 md:h-full">
                  <h1 className="font-semibold text-xl sm:text-2xl xl:text-2xl me-auto">
                    Friend Invites
                  </h1>
                  <div className="">
                    {friendInvites.map((invite, index) => (
                      <FriendInvites
                        key={index}
                        name={invite.name}
                        avatar={invite.avatar}
                      />
                    ))}
                  </div>
                </div>
                <div className="team-invites rounded-md border border-input p-4 md:flex-1 overflow-y-auto h-1/2 md:h-full">
                  <h1 className="font-semibold text-xl sm:text-2xl xl:text-2xl me-auto">
                    Team Invites
                  </h1>
                  <div className="">
                    {teamInvites.map((invite, index) => (
                      <TeamInvites key={index} name={invite.name} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="utils max-w-min hidden xl:block">
              <CustomCalendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border border-input h-fit mb-3 h-max"
              />
              <div className="day-breakdown rounded-md border border-input p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                  <h1 className="font-semibold text-3xl">Today</h1>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-1 px-4 rounded">
                    Add
                  </button>
                </div>
                <div className="event-list">
                  {events.map((event, index) => (
                    <Event key={index} name={event.name} time={event.time} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {individualChatOpen ? (
        <ChatBox setindividualChatOpen={setindividualChatOpen} />
      ) : (
        <ChatCanvas
          setindividualChatOpen={setindividualChatOpen}
          chatListOpen={chatListOpen}
          setChatListOpen={setChatListOpen}
        />
      )}
    </>
  );
}

export default PersonalDashboard;
