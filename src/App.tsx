
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import RootLayout from "./pages/RootLayout";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import OtpModal from "./pages/OtpModal";
import {EditProfile} from "./pages/EditProfile"
import Home from "./pages/Home";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "otp", element: <OtpModal /> },
      { path: "edit-profile", element: <EditProfile /> },
    ],
  },
]);


const App = () => {


  return <RouterProvider router={router} />;

};


export default App
