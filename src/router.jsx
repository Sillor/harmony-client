import App from './components/App';
import VideoCall from "./pages/video-call/VideoCallPage";
import Login from './pages/Login';
import Register from './pages/Register';
import FileManagement from './pages/file-management/FileManagement';
import FileManagementPage from "./pages/file-management/FileManagementPage";
import GroupDashboard from './pages/group-dashboard/GroupDashboard';
import PersonalDashboard from './pages/personal-dashboard/PersonalDashboard';
import Groups from './pages/groups/Groups'
import Profile from "./pages/profile/Profile";
import { createBrowserRouter, redirect } from "react-router-dom";
import { checkLoggedIn } from './utils/db';

const redirectToLogin = () => {
  const isLoggedIn = checkLoggedIn();
  if (isLoggedIn) return null;
  return redirect("/login");
}

const redirectToDashboard = () => {
  const isLoggedIn = checkLoggedIn();
  if (isLoggedIn) return redirect("/personalDashboard");
  return null;
}

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <div>
        Error occurred in app
        <br />
        <a href="/" className="text-blue-400">
          Return Home
        </a>
      </div>
    ),
    children: [
      {
        errorElement: <div>Error occurred in outlet</div>,
        children: [
          {
            index: true,
            element: <PersonalDashboard/>,
            loader: () => {
              const isLoggedIn = checkLoggedIn();
              if (isLoggedIn) return redirect("/personalDashboard");
              return redirect("/login");
            },
          },
          {
            path: "/files/:chatId?",
            element: <FileManagementPage />,
            loader: redirectToLogin
          },
          {
            path: "/video",
            element: <VideoCall />,
            loader: redirectToLogin
          },
          {
            path: "/login",
            element: <Login />,
            loader: redirectToDashboard
          },
          {
            path: "/register",
            element: <Register />,
            loader: redirectToDashboard
          },
          {
            path: "/profile",
            element: <Profile />,
            loader: redirectToLogin
          },
          {
            path: "/group/:group",
            element: <GroupDashboard />,
            loader: redirectToLogin
          },
          {
            path: '/groups',
            element: <Groups />,
          },
          {
            path: "/personalDashboard",
            element: <PersonalDashboard />,
            loader: redirectToLogin
          },
        ],
      },
      {
        path: "*",
        element: (
          <div>
            Page does not exist
            <br />
            <a href="/" className="text-blue-400">
              Return Home
            </a>
          </div>
        ),
      },
    ],
  },
]);
