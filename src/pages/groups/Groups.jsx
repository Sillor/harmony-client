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

import axios from 'axios';
import CreateTeamDialog from "./CreateTeamDialog";

import { useState, useEffect } from "react";

const Groups = () => {

    const [groupName, setGroupName] = useState("");
    const [groupOwner, setGroupOwner] = useState("");

    const groupsList = [
        {
            name: 'group1',
            owner: 'Joe Blow',
            memberCount: 2,
        },
        {
            name: 'group2',
            owner: 'Moe Snow',
            memberCount: 3,
        },
        {
            name: 'group3',
            owner: 'Mikey Stone',
            memberCount: 5,
        }
    ]

let [groupData, setGroupData] = useState([])

useEffect(() => {
    axios.get('http://localhost:5001/loadJoinedTeams', {
        withCredentials: true,
    })
    .then(response => {
        console.log('raw response:',response);
        console.log('data response:',response.data.data);

        setGroupData(response.data.data)

    })
        .catch(error => {
        console.error('Error loading teams:', error);
    });
}, []);

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
                            <TableHead>Team Name</TableHead>
                            <TableHead>Owned?</TableHead>
                            
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {console.log('jsx:',groupData)}
                        {groupData.length > 0 && groupData.map((group, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium"><a className="text-blue-500" href={`/group/${group.name}`}>{group.name}</a></TableCell>
                                <TableCell>{group.owned ? 'Yes' : 'No'}</TableCell>
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
