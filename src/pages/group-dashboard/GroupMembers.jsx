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

function GroupMembers({groupName}) {

    const [members, setMembers] = useState([
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
                            {members.map((member) => <span className='display: block' key={member.id}>{member.name}</span>)}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
        </div>
    )
}

export default GroupMembers;
