import React from "react";

function TeamInvites({ name, resolve}) {
  return (
    <>
      <div className="TeamInvite-body border border-input rounded-md flex p-2 mb-2 justify-between items-center">
        <div className="invite-body me-6 flex items-center">
          <img
            src="assets\\img\\groupChat.png"
            alt="groupChatAvatar"
            className="rounded-full w-10 h-10 object-cover me-2 flex-shrink-0"
          />
          <h1 className="font-semibold text-sm me-auto text-center">{name}</h1>
        </div>
        <div className="flex flex-col">
          <button className="bg-primary hover:bg-primary/90 text-sm text-primary-foreground px-2 mb-2 rounded-lg" onClick={() => resolve(true)}>
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

export default TeamInvites;
