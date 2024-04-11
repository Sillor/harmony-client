import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';

  import axios from 'axios';


function GroupMembers({groupName}) {

    const [members2, setMembers2] = useState([
        {
          name: 'Bob Johnson',
          id: 1,
          avatar: '..\\src\\assets\\img\\pexels-justin-shaifer-1222271.jpg',
        },
        {
          name: 'Alice Smith',
          id: 2,
          avatar: '..\\src\\assets\\img\\pexels-andrea-piacquadio-774909.jpg',
        },
      ]);

// Grab team UID
const [teamUID, setTeamUID] = useState('')
  useEffect(() => {
    axios.get('http://localhost:5001/loadJoinedTeams', {
        withCredentials: true,
    })
    .then(response => {
        const group = response.data.data.find(group => group.name === groupName);
        if (group) {
         setTeamUID(group.uid);
        }
    })
        .catch(error => {
        console.error('Error loading teams:', error);
    });
}, []);

// Load team member list
const [members, setMembers] = useState([])
useEffect(() => {
  if (teamUID) {
    axios.post('http://localhost:5001/loadteammemberlist', {
          teamUID: teamUID,
          teamName: groupName
    }, {
        withCredentials: true
    })
    .then(response => {
        console.log(response.data.data);
        setMembers(response.data.data)
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }
}, [teamUID]);

  return (
          
          <div className="rounded-md p-3">
            <div className="">
              <Dialog>
                <DialogTrigger className="hover:bg-primary/10 font-bold py-1 px-3 rounded">
                  <h1 className="font-semibold text-md">{groupName}</h1>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px]">
                  <DialogHeader>
                    <DialogTitle>Group Members</DialogTitle>
                    <DialogDescription>
                            {members.map((member) => <span className='display: block' key={member.username}>{member.username}</span>)}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
        </div>
    )
}

export default GroupMembers;
