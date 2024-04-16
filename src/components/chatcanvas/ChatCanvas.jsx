import {useState } from "react";

const ChatCanvas = ({ setindividualChatOpen, chatListOpen, setChatListOpen }) => {
    const chatListHandler = () => {
        setChatListOpen(prevState => !prevState);
    }
    const individualChatClickHandler = () => {
        setindividualChatOpen(true);
    }
    const [friends, setFriends] = useState([
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


    return (
        <div className="flex flex-col chat-button w-[80px] md:w-[288px] dark:bg-black text-primary">
           {!chatListOpen &&<button className=" flex items-center justify-center md:p-2 md:justify-start" onClick={chatListHandler}>
                <svg className="font-semibold w-[20px] md:w-[40px]" height="40" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>
                <h1 className="text-sm md:text-xl md:ms-5">Friends</h1>
              </button>}
            {chatListOpen &&
                <div className="flex flex-col chat-canvas  w-[75vw] md:w-[288px] dark:bg-black text-primary">
                    <button className="border-b md:p-2 flex items-center justify-center md:justify-start" onClick={chatListHandler}>
                        <svg className="font-semibold w-[20px] md:w-[40px]" height="40" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.13523 8.84197C3.3241 9.04343 3.64052 9.05363 3.84197 8.86477L7.5 5.43536L11.158 8.86477C11.3595 9.05363 11.6759 9.04343 11.8648 8.84197C12.0536 8.64051 12.0434 8.32409 11.842 8.13523L7.84197 4.38523C7.64964 4.20492 7.35036 4.20492 7.15803 4.38523L3.15803 8.13523C2.95657 8.32409 2.94637 8.64051 3.13523 8.84197Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>
                        <h1 className="text-sm md:text-xl md:ms-5">Friends</h1>
                    </button>
                    <div className="mt-3 h-[75vh] scrollable-div ">
                        {friends.map((friend, index) => (
                            <div className="chat-button border border-input rounded-md flex p-3 mb-2 flex-col relative ms-5 dark:bg-black text-primary" onClick={individualChatClickHandler} key={index}>
                                <div className="flex  w-full items-center">
                                    <div className="me-5">
                                        <img
                                            src={friend.avatar || "https://via.placeholder.com/40"}
                                            alt="avatar"
                                            className="rounded-full w-10 h-10 object-cover flex-shrink-0"
                                        />
                                    </div>
                                    <div>
                                        <h1 className="font-semibold text-md md:text-xl me-auto">{friend.name}</h1>
                                    </div>
                                </div>
                            </div>
                        ))}
                       
                    </div>
                     <div className="flex justify-center  mt-1">
                    <button className="bg-primary text-primary-foreground p-2 mb-2 rounded-md w-11/12">Add Friend</button>
                </div>
                </div>
            }
        </div>
    );
}

export default ChatCanvas;
