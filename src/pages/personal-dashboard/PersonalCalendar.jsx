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

    const date = props.date.slice(0, 16)
    const startTime = props.start ? props.start.slice(11,16) : 'N/A'
    const endTime = props.end ? props.end.slice(11, 16) : 'N/A'

    const convertTo12HourFormat = (time) => {
        if(time === 'N/A'){
            return time
        }
        const hours = parseInt(time.split(':')[0]);
        const minutes = time.split(':')[1];
        const period = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12; // Convert hours greater than 12 to 12-hour format
        return `${adjustedHours}:${minutes} ${period}`;
      };

    return (
        <div className="event flex items-center justify-between border-b hover:scale-95 py-2 pe-2 group bg-secondary mb-3 p-2">
          <div className="event-details">
            <p className="text-sm"><b>Team:</b> {props.team}</p>
            <p className="text-sm"><b>Name:</b> {props.name}</p>
            <p className="text-sm"><b>Date:</b> {date}</p>
            <p className="text-sm"><b>Start:</b> {convertTo12HourFormat(startTime)}</p>
            <p className="text-sm"><b>End:</b> {convertTo12HourFormat(endTime)}</p>
            <p className="text-sm"><b>Description:</b> {props.description}</p>
          </div>
        </div>
    );
  }


function PersonalCalendar({date, setDate, teamNames}) {

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000/api/calendar',
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

    let currentDate = String(date)

  
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
                        date={currentDate}
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
