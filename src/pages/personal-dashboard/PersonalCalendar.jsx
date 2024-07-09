import React from 'react'
import {useState, useEffect} from 'react'
import { Calendar as CustomCalendar } from '@/components/ui/calendar';
import axios from 'axios';
import { DateTime } from 'luxon'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function Event(props) {
  return (
    <div className="event flex items-center justify-between border-b hover:bg-secondary py-2 pe-2 group">
      <div className="event-details">
        <h2 className="font-semibold text-sm">{props.name}</h2>
        <p className="text-sm">{props.date.slice(0,10)} | {props.date.slice(11,16)} - {props.date.slice(20,25)}</p>
        <p className="text-sm">{props.description}</p>
      </div>
      
    </div>
  );
}

function PersonalCalendar({date, setDate, groupName}) {

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000/api/calendar', // Replace with your API base URL
        withCredentials: true
      });

    const monthNames = [
        'Jan.',
        'Feb.',
        'Mar.',
        'Apr.',
        'May',
        'Jun.',
        'Jul.',
        'Aug.',
        'Sep.',
        'Oct.',
        'Nov.',
        'Dec.',
      ];

    const [events, setEvents] = useState([])

    const [eventForm, setEventForm] = useState({
        calendar: groupName,
        event: {name: '', date: '', startTime: '', endTime: '', description: ''},
      });

    console.log('team names:',groupName);
  
    const refetchEvents = async () => {
        try {
            setEvents([]);
            const allEvents = [];
            for (const groupName of groupName) {
            const response = await axiosInstance.get(`/listevents/${groupName}?date=${formattedDate}`);
            const data = response.data;
            if (data && Array.isArray(data)) {
                allEvents.push(data);
            } else {
                setEvents([]);
            }
            }
            setEvents(allEvents);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            // console.log('date:',date);
            try {
                // console.log('Use Effect Has Ran!');
                setEvents([])
                if(date){
                const formattedDate = DateTime.fromJSDate(new Date(date)).toISODate();
                // console.log('formatted date:', formattedDate);
                const response = await axiosInstance.get(`/listevents/${groupName[0]}?date=${formattedDate}`, {
                })
                const data = response.data
                if (Array.isArray(data)) {
                    setEvents(data);
                } else {
                    setEvents([])
                    // console.log('Data is not an array:', data);
                }}
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchEvents();
    }, [date]);
  
    const convertTo12HourFormat = (time) => {
        const hours = parseInt(time.split(':')[0]);
        const minutes = time.split(':')[1];
        const period = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12; // Convert hours greater than 12 to 12-hour format
        return `${adjustedHours}:${minutes} ${period}`;
    };
  
    return (
        <div className="utils max-w-min">
            <CustomCalendar
                mode="single"
                selected={date}
                onSelect={(date) => setDate(date)}
                className="rounded-md border border-input h-fit mb-3"
            />
            <div className="day-breakdown rounded-md border border-input p-4">
                <div className="flex justify-between items-center mb-3">
                    <h1 className="font-semibold text-xl">{ date ? String(date).slice(0,15) : '-'}</h1>
                </div>
                <div className="event-list">
                {events.length === 0 ? (
                    <div className="event flex items-center justify-between border-b hover:bg-secondary py-2 pe-2 group">
                    <div className="event-details">
                        <h2 className="font-semibold text-sm">No events on this date.</h2>
                    </div>
                    </div>
                ) : events.map((event, index) => (
                    <Event 
                    key={index} 
                    name={event.name} 
                    time={event.startTime ? `${convertTo12HourFormat(event.startTime)} - ${convertTo12HourFormat(event.endTime)}` : 'All Day'} 
                    description={event.description}
                    date={event.date}
                    groupName={groupName}
                    refetchEvents={refetchEvents}
                    />
                ))}
                </div>
            </div>
        </div>
    );
}

export default PersonalCalendar;
