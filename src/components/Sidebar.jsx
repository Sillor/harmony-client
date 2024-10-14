import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  ChatBubbleIcon,
  CalendarIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import {
  Camera,
  CircleUserRoundIcon,
  FilesIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UsersIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logout, checkLoggedIn } from "../utils/authHandler";

const links = [
  {
    icon: (
      <LayoutDashboardIcon className="mr-2 h-6 w-6 text-black dark:text-white" />
    ),
    name: "Dashboard",
    path: "/",
  },
  // {
  //   icon: <UsersIcon className="mr-2 h-6 w-6 text-black dark:text-white" />,
  //   name: "Groups",
  //   path: "/group",
  // },
  // {
  //   icon: (
  //     <ChatBubbleIcon className="mr-2 h-6 w-6 text-black dark:text-white" />
  //   ),
  //   name: "Chat",
  //   path: "/chat",
  // },
  {
    icon: <FilesIcon className="mr-2 h-6 w-6 text-black dark:text-white" />,
    name: "File Management",
    path: "/files",
  },
  {
    icon: <Camera className="mr-2 h-6 w-6 text-black dark:text-white" />,
    name: "Video Chat",
    path: "/video",
  },
  // {
  //   icon: <CalendarIcon className="mr-2 h-6 w-6 text-black dark:text-white" />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  {
    icon: (
      <CircleUserRoundIcon className="mr-2 h-6 w-6 text-black dark:text-white" />
    ),
    name: "Profile",
    path: "/profile",
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const data = await logout();
    if (!data.success) {
      console.log("error", data)
      return;
    }
    navigate("/");
  };

  return (
    <>
      <Drawer direction="left">
        {checkLoggedIn() && (
          <DrawerTrigger className="">
            <HamburgerMenuIcon className="h-7 w-7" />
          </DrawerTrigger>
        )}
        <DrawerContent className="top-0 left-0 mt-0 w-[250px] rounded-none border-none shadow shadow-primary">
          <DrawerHeader>
            <DrawerTitle className="mb-4 h-12 flex items-center shadow-md dark:shadow-black">
              <DrawerClose className="flex px-3 items-center gap-3">
                <HamburgerMenuIcon className="h-7 w-7" />
                <h1 className="text-2xl font-bold mb-0">Harmony</h1>
              </DrawerClose>
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col grow gap-3">
            {links.map(({ icon, name, path }, i) => {
              return (
                <DrawerClose key={i} asChild>
                  <Button
                    asChild
                    className="text-lg w-full justify-start px-5 h-10"
                    variant="ghost"
                  >
                    <Link to={path}>
                      {icon}
                      {name}
                    </Link>
                  </Button>
                </DrawerClose>
              );
            })}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="w-full" onClick={handleLogout}>
                <LogOutIcon className="mr-2 h-6 w-6" />
                Logout
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default Sidebar;
