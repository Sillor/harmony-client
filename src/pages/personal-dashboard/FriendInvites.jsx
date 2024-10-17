import React from "react";

function FriendInvites({ name, avatar, resolve }) {
  return (
    <>
      <div className="FrindInvite-body border border-input rounded-md flex p-2 mb-2 justify-between items-center">
        <div className="invite-name me-6 flex items-center">
          <img
            src={avatar || "https://via.placeholder.com/40"}
            alt="avatar"
            className="rounded-full w-10 h-10 object-cover me-5 flex-shrink-0"
          />
          <h1 className="font-semibold text-sm me-auto text-center">{name}</h1>
        </div>
        <div className="flex flex-col">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm px-2 mb-2 rounded-lg" onClick={() => resolve(true)}> 
            Accept
          </button>
          <button className="bg-primary hover:bg-destructive text-sm text-primary-foreground px-2 rounded-lg" onClick={() => resolve(false)}>
            Decline
          </button>
        </div>
      </div>
    </>
  );
}

export default FriendInvites;
