import { Outlet } from "react-router";
import FileManagement from "../pages/file-management/FileManagement";
import GoogleCalendar from "./GoogleCalendar";
import setTheme from "../utils/setTheme";
import ThemeSwitcher from "./ThemeSwitcher";

function App() {
  setTheme();
  return (
    <>
      <nav className="z-50 w-full h-12 bg-background sticky top-0 flex items-center px-3 justify-between group shadow-md dark:shadow-black">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-muted-foreground"></div>
          <div className="font-bold text-2xl">Harmony</div>
        </div>
        <div>
          <div className="justify-self-end flex items-center w-6 h-6">
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
        <GoogleCalendar username='User1' />
      </main>
    </>
  );
}
export default App;
