import React, { useEffect, useState } from "react";
import { FiHome, FiPlusSquare, FiHeart, FiSearch, FiMenu, FiLogOut } from "react-icons/fi";
import { RiMovieLine } from "react-icons/ri";
import insta_logo from "../assets/Vector.png";
import SidebarItem from "./SidebarItems";
import CustomImage from "../components/CustomImage";
import api from "../utils/api";
import fallbackImg from "../assets/pi.jpg"; // fallback profile image

interface SidebarProps {
  onClick: (page: string) => void;
  onLogout: () => void;
}

const BACKEND_URL = "http://localhost:4000";

const Sidebar: React.FC<SidebarProps> = ({ onClick, onLogout }) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const token = localStorage.getItem("accessToken");

  const fetchUserProfile = async () => {
    try {
      if (!token) return;

      const res = await api.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserProfile(
        res.data?.user_profile
          ? `${BACKEND_URL}/uploads/${res.data.user_profile}?t=${Date.now()}`
          : null
      );
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    const interval = setInterval(fetchUserProfile, 1000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <aside className="fixed z-30 bg-white">
  
      <div className="hidden md:flex flex-col w-64 h-screen border-r px-4 py-6 gap-2">
        <img src={insta_logo} className="w-28 mb-6" />

        <SidebarItem icon={<FiHome size={24} />} text="Home" onClick={() => onClick("home")} />
        <SidebarItem icon={<FiSearch size={24} />} text="Search" onClick={() => onClick("search")} />
        <SidebarItem icon={<FiPlusSquare size={24} />} text="Create" onClick={() => onClick("createPost")} />
        <SidebarItem icon={<RiMovieLine size={24} />} text="Reels" onClick={() => onClick("")} />
        <SidebarItem icon={<FiHeart size={24} />} text="Notifications" onClick={() => onClick("notifications")} />

        <SidebarItem
          icon={
            <CustomImage
              imgSrc={userProfile || fallbackImg}
              fallBack={fallbackImg}
              className="w-6 h-6 rounded-full object-cover"
              alt="Profile"
            />
          }
          text="Profile"
          onClick={() => onClick("profile")}
        />

        <hr className="my-4 border-gray-300" />

        <SidebarItem
          icon={<FiMenu size={24} />}
          text="Menu"
          onClick={() => setShowMoreOptions(!showMoreOptions)}
        />

        {showMoreOptions && (
          <SidebarItem
            icon={<FiLogOut size={24} />}
            text="Logout"
            onClick={onLogout}
          />
        )}
      </div>
      
      <div className="md:hidden fixed bottom-0 left-0 w-full h-16 border-t bg-white flex justify-around items-center">
        <FiHome size={22} onClick={() => onClick("home")} />
        <FiSearch size={22} onClick={() => onClick("search")} />
        <FiPlusSquare size={22} onClick={() => onClick("createPost")} />
        <SidebarItem icon={<RiMovieLine size={22} />} text="Reels" onClick={() => onClick("")} />
        <FiHeart size={22} onClick={() => onClick("notifications")} />

        <CustomImage
          imgSrc={userProfile || fallbackImg}
          fallBack={fallbackImg}
          className="w-6 h-6 rounded-full object-cover"
          alt="Profile"
          onClick={() => onClick("profile")}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
