import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Outlet />
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default AuthLayout;
