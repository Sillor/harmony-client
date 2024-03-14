import React from 'react';
import { X } from 'lucide-react';

function Event({ name, time, description }) {
  return (
    <div className="event flex items-center justify-between border-b hover:bg-secondary py-2 pe-2 group">
      <div className="event-details">
        <h2 className="font-semibold text-sm">{name}</h2>
        <p className="text-sm">{time}</p>
        <p className="text-sm">{description}</p>
      </div>
      <div
        className="delete-icon opacity-0 group-hover:opacity-100"
        onClick={onDelete}
      >
        <X />
      </div>
    </div>
  );
}

export default Event;
