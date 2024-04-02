// Will need to fetch the list of groups from the SQL table at some point but for now they are hard coded
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { CheckIcon } from "lucide-react";
import { XIcon } from "lucide-react";

import CreateTeamDialog from "./CreateTeamDialog";

import { useState } from "react";

const Groups = () => {

    const [groupName, setGroupName] = useState("");
    const [groupOwner, setGroupOwner] = useState("");

    const groupsList = [
        {
            name: 'group1',
            owner: 'Joe Blow',
            memberCount: 2,
            isJoined: true
        },
        {
            name: 'group2',
            owner: 'Moe Snow',
            memberCount: 3,
            isJoined: false
        },
        {
            name: 'group3',
            owner: 'Mikey Stone',
            memberCount: 5,
            isJoined: true
        }
    ]

  return (
    <>

        <Card className="w-2/3 mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Groups</CardTitle>
            </CardHeader>
            <CardContent>
                <Table className="">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Group Name</TableHead>
                            <TableHead>Group Owner</TableHead>
                            <TableHead>Number of Members</TableHead>
                            <TableHead>Joined?</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {groupsList.map((group, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium"><a className="text-blue-500" href={`/group/${group.name}`}>{group.name}</a></TableCell>
                                <TableCell>{group.owner}</TableCell>
                                <TableCell>{group.memberCount}</TableCell>
                                <TableCell className="">{group.isJoined ? <CheckIcon /> : <XIcon />}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <CreateTeamDialog groupName={groupName} setGroupName={setGroupName} groupOwner={groupOwner} setGroupOwner={setGroupOwner} />
    </> 
  );
};

export default Groups;
