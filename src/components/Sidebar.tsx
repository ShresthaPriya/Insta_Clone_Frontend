import React from "react";
import { FiHome, FiPlusSquare, FiHeart, FiSearch, FiUser, FiMenu } from "react-icons/fi";
import insta_logo from "../assets/Vector.png";
import SidebarItem from "./SidebarItems";

interface SidebarProps {
  onClick: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClick }) => {
  return (
<aside className="fixed left-0 top-0 w-64 h-screen border-r bg-white">
  <div className="flex flex-col gap-8 h-full px-4 py-6 ">
 
    <div className="mb-6 px-2">
      <img src={insta_logo} alt="Instagram Logo" className="w-28" />
    </div>

   
    <div className="flex flex-col gap-8 text-[16px] font-medium">
      <SidebarItem icon={<FiHome size={24} />} text="Home" onClick={() => onClick("home")} />
      <SidebarItem icon={<FiSearch size={24} />} text="Search" onClick={() => onClick("search")} />
      <SidebarItem icon={<FiPlusSquare size={24} />} text="Create" onClick={() => onClick("createPost")} />
      <SidebarItem icon={<FiHeart size={24} />} text="Notifications" onClick={() => onClick("notifications")} />
      <SidebarItem icon={<FiUser size={24} />} text="Profile" onClick={() => onClick("profile")} />
      <SidebarItem icon={<FiMenu size={24} />} text="More" onClick={() => onClick("more")} />

    </div>


  </div>
</aside>

  );
};



export default Sidebar;
