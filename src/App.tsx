import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import AuthLayout from "./pages/AuthLayout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import { EditProfile } from "./pages/EditProfile";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AccountSettings from "./pages/AccountSettings";
import {Notifications} from "./components/Notifications";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, 
    children: [
      { index: true, element: <Home /> },
      { path: "edit-profile", element: <EditProfile /> },
      { path: "profile/:userName", element: <Profile /> },
      {path:"/account-settings", element:<AccountSettings />},
      { path: "/notifications", element: <Notifications/>}
    ]
  },
  {
    path: "/",
    element: <AuthLayout />, 
    children: [
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
