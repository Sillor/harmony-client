import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { ArrowLeftRight, Trash2Icon } from "lucide-react";
import ConfirmDialog from "../../components/ConfirmDialog";
const ManageMembersDialog = ({ removeMember, getMembers }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getMembers().then((data) => setMembers(data));
  }, []);

  function handleRemoveConfirm(email) {
    setMembers((prev) => {
      const obj = [...prev];
      obj.filter((e) => e.email !== email);
      return obj;
    });
    removeMember(email);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-[140px] h-[28px] px-[0px] mb-1">
          Manage Members
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[300px] md:max-w-[425px] rounded-md">
        <DialogHeader>
          <DialogTitle>Manage Members</DialogTitle>
        </DialogHeader>
        <div>
          <ScrollArea className="max-h-[80svh] max-w-[300px] md:max-w-[425px] pe-2">
            {members
              .sort((a, b) => (a.owner && !b.owner ? -1 : 1))
              .map((member) => {
                return (
                  <div className="h-7 flex justify-between" key={member.email}>
                    <div
                      className={
                        "overflow-hidden whitespace-nowrap text-ellipsis" +
                        (member.owner ? " font-semibold" : "") +
                        (member.removed ? " line-through" : "")
                      }
                    >
                      {member.email}
                      {member.owner && <span> (you)</span>}
                    </div>
                    {!member.owner && !member.removed && (
                      <div className="text-nowrap">
                        <ConfirmDialog
                          title={"Transfer Ownership"}
                          message={`Are you sure you want to transfer ownership to user "${member.email}"`}
                          trigger={
                            <Button variant="ghost" className="p-0 w-7 h-7">
                              <ArrowLeftRight className="text-red-500 w-5 h-5" />
                            </Button>
                          }
                          destructive
                        />
                        <ConfirmDialog
                          title="Remove User"
                          message={`Are you sure you want to remove user "${member.email}"`}
                          trigger={
                            <Button variant="ghost" className="p-0 w-7 h-7">
                              <Trash2Icon className="text-red-500 w-5 h-5" />
                            </Button>
                          }
                          onConfirm={() => handleRemoveConfirm(member.email)}
                          destructive
                        />
                      </div>
                    )}
                  </div>
                );
              })}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembersDialog;
