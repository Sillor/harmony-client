import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { peer } from "../../utils/globals";

export default function AvailableRooms({ members }) {
  const { users, groups } = members;
  const usersLength = Object.keys(users).length;
  return (
    <Card className="border-input w-[calc(100%-2rem)] md:w-[60vw]">
      <CardHeader>
        <CardTitle>Rooms</CardTitle>
        <CardDescription>Select Room To Join</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3">
        <ScrollArea
          className="h-52 border-input border p-3 rounded-md flex-1"
          key="0"
        >
          <h4 className="mb-4 text-sm font-medium leading-none">Teams</h4>
          {Object.keys(groups).length ? (
            Object.entries(groups).map(([key, val], i) => {
              return (
                <div key={i}>
                  <div
                    className="cursor-pointer"
                    key={i}
                    onClick={() => peer.joinRoom(key)}
                  >
                    {key}
                  </div>
                  <Separator className="my-1" key={"separator_" + i} />
                </div>
              );
            })
          ) : (
            <small>No Teams</small>
          )}
        </ScrollArea>
        <ScrollArea
          className="h-52 border-input border p-3 rounded-md flex-1"
          key="1"
        >
          <h4 className="mb-4 text-sm font-medium leading-none">Users</h4>
          {usersLength ? (
            Object.entries(users)
              .filter(([key]) => key !== peer.socketId)
              .map(([key, val], i) => {
                return (
                  <div key={i}>
                    <div
                      className="cursor-pointer"
                      key={i}
                      onClick={() => peer.call(key)}
                    >
                      {val.username}
                    </div>
                    <Separator className="my-1" key={"separator_" + i} />
                  </div>
                );
              })
          ) : (
            <small>None Online</small>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
