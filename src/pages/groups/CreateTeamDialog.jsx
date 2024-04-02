import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";


const CreateTeamDialog = ({groupName, groupOwner, setGroupName, setGroupOwner}) => {

  const handleCreateGroup = async () => {
    try {
        await axios.get(`http://localhost:5000/api/calendar/createcalendar?groupName=${groupName}`);
        setGroupName('')
        setGroupOwner('')
        // need to add function for inserting group details into the database
    } catch (error) {
        console.error("Error creating calendar:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="mt-4">
          <PlusCircleIcon/>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[300px] md:max-w-[425px] rounded-md">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <label htmlFor="groupName">Group Name:</label>
                <Input
                    id="groupName"
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <label htmlFor="groupOwner">Group Owner:</label>
                <Input
                    id="groupOwner"
                    type="text"
                    value={groupOwner}
                    onChange={(e) => setGroupOwner(e.target.value)}
                />
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="md:w-[130px] bg-white text-black border border-primary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleCreateGroup} type="submit" className="md:w-[130px] mb-2 md:mb-0">
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamDialog;
