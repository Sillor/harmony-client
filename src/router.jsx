import App from "./components/App";
import Register from "./pages/Register";
import FileManagement from "./pages/file-management/FileManagement";
import {createBrowserRouter} from "react-router-dom"
export default createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <div>Error occurred in app<br/><a href="/" className="text-blue-400">Return Home</a></div>,
    children: [
      {
        errorElement: <div>Error occurred in outlet</div>,
        children: [
          {
            index: true,
            element: <div>Welcome to Harmony!</div>
          },
          {
            path: "/files",
            element: <FileManagement />
          },
          {
            path: "/register",
            element: <Register />
          }
        ]
      },
      {
        path: "*",
        element: <div>Page does not exist<br/><a href="/" className="text-blue-400">Return Home</a></div>
      }
    ]
  }
])