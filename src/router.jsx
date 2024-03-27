import App from './components/App';
import VideoChat from './pages/VideoChat';
import Login from './pages/Login';
import Register from './pages/Register';
import FileManagement from './pages/file-management/FileManagement';
import GroupDashboard from './pages/group-dashboard/GroupDashboard';
import PersonalDashboard from './pages/personal-dashboard/PersonalDashboard';
import Groups from './pages/Groups'
import { createBrowserRouter } from 'react-router-dom';
export default createBrowserRouter([
  {
    path: '/',
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
          },
          {
            path: '/files',
            element: <FileManagement />,
          },
          {
            path: '/video',
            element: <VideoChat />,
          },
          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/register',
            element: <Register />,
          },
          {
            path: '/group/:group',
            element: <GroupDashboard />,
          },
          {
            path: '/groups',
            element: <Groups />,
          },
        ],
      },
      {
        path: '*',
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
