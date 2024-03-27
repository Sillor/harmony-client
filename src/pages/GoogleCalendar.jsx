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

const CalendarTemplate = ({groupName}) => {
  let [calendarId, setCalendarId] = useState('');

  useEffect(() => {
    const fetchCalendarId = async () => {
      try {
        if(groupName){
          // const response = await fetch(`http://localhost:3000/calendarId/${groupName}`); // Replace with proper endpoint once available
        } 
        // const data = await response.json();
        // setCalendarId(data.calendarId.substring(0, data.calendarId.length - 26));
        if(groupName === 'group2'){
          await setCalendarId('77d6dfc0640d4f8f0d11fb76f019496305e4e4cadd70e5fdcdea6bd8af7f47eb')
        }
        else if(groupName === 'group1'){
          await setCalendarId('1608ac325d341844789f0db022f33f3c13906895cbfa7e0f981d48959ae25654')
        }
        else {
          await setCalendarId('')
        }
      } catch (error) {
        console.error('Error setting calendar ID:', error);
      }
    };
    fetchCalendarId();
    console.log(calendarId);
  }, [groupName]);

  const src = `https://calendar.google.com/calendar/embed?src=${calendarId}%40group.calendar.google.com&ctz=America%2FLos_Angeles`;

  return ( 
    <>
        <iframe
            className='border-double border-8 border-black dark:border-gray-700 rounded-lg'
            src={src}
            style={{ width: '70vw', height: '80vh', borderRadius: 15}}
            title='calendar'
        ></iframe>
    </>
  )
}

const GoogleCalendar = ({username}) => {

  const [groupName, setGroupName] = React.useState("")
  
  // Some code to fetch list of users groups from the sql database and add them to the following array will be added at some point
  const [calendarList, setCalendarList] = React.useState([
    'group1',
    'group2',
    'group3'
  ])


  return (
    <div className='k'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div style={{ display: 'flex', justifyContent: 'center' }}><Button className='w-full bg-black text-white dark:bg-gray-700 mb-1' variant="outline">{username} Select Calendar</Button></div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-30">
          <DropdownMenuRadioGroup value={groupName} onValueChange={setGroupName}>
            {calendarList.map(calendar => (
              <DropdownMenuRadioItem key={calendar} value={calendar}>{calendar}</DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <CalendarTemplate groupName={groupName} />
    </div>
  )
};

export default GoogleCalendar;