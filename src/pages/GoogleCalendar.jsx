import React from 'react';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const GoogleCalendar = () => {

  const [groupName, setGroupName] = React.useState("")
  console.log(groupName);

  const [srcId, setSrcId] = React.useState('harmonyapp2024%40gmail.com')


  let [calendars, setCalendars] = useState([
    {
      "name": "harmonyapp2024@gmail.com",
      "id": "harmonyapp2024@gmail.com"
    }
  ]);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        console.log('fetch is running');
        const response = await fetch(`http://localhost:5000/api/calendar/listcalendars`);
        console.log('fetch response:', response);
        const data = await response.json();
        console.log('fetch data:', data);
        setCalendars(data.filter(calendar => calendar.name !== "harmonyapp2024@gmail.com"));
      } catch (error) {
        console.error('Error fetching calendars:', error);
      }
    };
    fetchCalendars();
  }, []);
  const sortedCalendars = [...calendars].sort((a, b) => a.name.localeCompare(b.name));


  useEffect(() => {
    const selectedCalendar = calendars.find(calendar => calendar.name === groupName);
    if (selectedCalendar) {
      setSrcId(selectedCalendar.id.split('@')[0]);
    }
  }, [groupName, calendars]);
  
  

  const src = calendars.length > 0 ? `https://calendar.google.com/calendar/embed?src=${srcId}%40group.calendar.google.com&ctz=America%2FLos_Angeles` : '';



  return (
    <div className='flex justify-center flex-col'>
      
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button style={{ width: '80vw'}} className='bg-black text-white dark:bg-gray-700 mb-2'>Select Calendar</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-30">
            <DropdownMenuRadioGroup value={groupName} onValueChange={setGroupName}>
              {sortedCalendars.map(calendar => (
                <DropdownMenuRadioItem key={calendar.id} value={calendar.name}>{calendar.name}</DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      
      <iframe
        className='border-double border-8 border-black dark:border-gray-700 rounded-lg'
        src={src}
        style={{ width: '80vw', height: '90vh', borderRadius: 15 }}
        title='calendar'
      ></iframe>
      <pre className='text-center mt-3'>To edit or delete calendar events, press the button on the bottom right of the calendar labeled "Google Calendar" or use the dashboard. -----------------------------------------^</pre>
    </div>
  )
};

export default GoogleCalendar;