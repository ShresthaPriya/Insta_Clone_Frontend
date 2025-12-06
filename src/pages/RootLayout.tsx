import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // ✅ make sure this path is correct
import { useState } from "react";

const RootLayout = () => {
  const [setPage] = useState<string>("home");

  return (
    <div className="flex min-h-screen font-roboto">
      <Sidebar onClick={setPage} />
      <main className="ml-64 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
