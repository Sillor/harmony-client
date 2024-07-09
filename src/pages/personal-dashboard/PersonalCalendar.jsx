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
    console.log('Event Props:', props);
    return (
      <div className="event flex items-center justify-between border-b hover:bg-secondary py-2 pe-2 group bg-white mb-3 p-2">
        <div className="event-details">
            <h2 className="text-sm"><b>Team:</b> {props.team}</h2>
            <h2 className="text-sm"><b>Name:</b> {props.name}</h2>
            <p className="text-sm"><b>Start:</b> {props.start}</p>
            <p className="text-sm"><b>End:</b> {props.end}</p>
            <p className="text-sm"><b>Description:</b> {props.description}</p>
        </div>
      </div>
    );
  }


function PersonalCalendar({date, setDate, teamNames}) {

    console.log('date:', date);

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
    console.log('events:',events);

    console.log('team names:', teamNames);
  
    useEffect(() => {
        const fetchEvents = async () => {
            const formattedDate = DateTime.fromJSDate(new Date(date)).toISODate();
            try {
                setEvents([])
                const allEvents = [];
                for (const teamName of teamNames) {
                    const response = await axiosInstance.get(`/listevents/${teamName}?date=${formattedDate}`);
                    const data = response.data;
                    if (data && Array.isArray(data)) {
                        allEvents.push(...data);
                    } else {
                        setEvents([]);
                    }
                }
                setEvents(allEvents);
                } catch (error) {
                    console.error('Error:', error);
                }
        };
        fetchEvents();
    }, [date]);

    const refetchEvents = async () => {
        try {
            setEvents([]);
            const allEvents = [];
            for (const teamName of teamNames) {
                const response = await axiosInstance.get(`/listevents/${teamName}?date=${formattedDate}`);
                const data = response.data;
                if (data && Array.isArray(data)) {
                    allEvents.push(...data);
                } else {
                    setEvents([]);
                }
            }
            setEvents(allEvents);
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
                        team={event.team} 
                        description={event.description}
                        start={event.start}
                        end={event.end}
                        refetchEvents={refetchEvents}
                    />
                ))}
                </div>
            </div>
        </div>
    );
}

export default PersonalCalendar;
