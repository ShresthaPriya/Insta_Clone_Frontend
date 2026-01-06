import React, { useEffect, useState } from "react";
import {
  FiPlusSquare,
  FiSearch,
  FiMenu,
  FiLogOut,
} from "react-icons/fi";
import {
  RiMovieLine,
  RiMovieFill,
  RiSendPlaneLine,
  RiSendPlaneFill,
} from "react-icons/ri";
import {
  AiOutlineHome,
  AiFillHome,
  AiOutlineCompass,
  AiFillCompass,
} from "react-icons/ai";
import { FaRegHeart, FaHeart } from "react-icons/fa";

import insta_logo from "../assets/Vector.png";
import SidebarItem from "./SidebarItems";
import CustomImage from "../components/CustomImage";
import api from "../utils/api";
import { BASE_URL } from "../utils/api";
import fallbackImg from "../assets/pi.jpg";

interface SidebarProps {
  onClick: (page: string) => void;
  onLogout: () => void;
}


const Sidebar: React.FC<SidebarProps> = ({ onClick, onLogout }) => {
  const [activeItem, setActiveItem] = useState("home");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("accessToken");

const fetchUserProfile = async () => {
  try {
    if (!token) return;
    const res = await api.get("/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserProfile(
      res.data?.user_profile
        ? `${BASE_URL}/uploads/${res.data.user_profile}?t=${Date.now()}`
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


  useEffect(() => {
    fetchUserProfile();
    const interval = setInterval(fetchUserProfile, 1000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchUnread = async () => {
    try {
      const res = await api.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const unread = res.data.filter((n: any) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch unread notifications", err);
    }
  };

  useEffect(() => {
    fetchUnread();
  }, []);

  return (
    <aside className="fixed z-30 bg-white">
      <div className="hidden md:flex flex-col w-64 h-screen border-r px-4 py-6 gap-2">
        <img src={insta_logo} className="w-28 mb-6" alt="logo" />

        <SidebarItem
          icon={
            activeItem === "home" ? (
              <AiFillHome size={24} />
            ) : (
              <AiOutlineHome size={24} />
            )
          }
          text="Home"
          isActive={activeItem === "home"}
          onClick={() => {
            setActiveItem("home");
            onClick("home");
          }}
        />

        <SidebarItem
          icon={<FiSearch size={24} />}
          text="Search"
          isActive={activeItem === "search"}
          onClick={() => {
            setActiveItem("search");
            onClick("search");
          }}
        />

        <SidebarItem
          icon={
            activeItem === "explore" ? (
              <AiFillCompass size={24} />
            ) : (
              <AiOutlineCompass size={24} />
            )
          }
          text="Explore"
          isActive={activeItem === "explore"}
          onClick={() => {
            setActiveItem("explore");
            onClick("explore");
          }}
        />

        <SidebarItem
          icon={
            activeItem === "reels" ? (
              <RiMovieFill size={24} />
            ) : (
              <RiMovieLine size={24} />
            )
          }
          text="Reels"
          isActive={activeItem === "reels"}
          onClick={() => {
            setActiveItem("reels");
            onClick("reels");
          }}
        />

        <SidebarItem
          icon={
            activeItem === "messages" ? (
              <RiSendPlaneFill size={24} />
            ) : (
              <RiSendPlaneLine size={24} />
            )
          }
          text="Messages"
          isActive={activeItem === "messages"}
          onClick={() => {
            setActiveItem("messages");
            onClick("messages");
          }}
        />

        <SidebarItem
          icon={
            <div className="relative">
              {activeItem === "notifications" ? (
                <FaHeart size={24} />
              ) : (
                <FaRegHeart size={24} />
              )}

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          }
          text="Notifications"
          isActive={activeItem === "notifications"}
          onClick={() => {
            setActiveItem("notifications");
            setUnreadCount(0); 
            onClick("notifications");
          }}
        />

        <SidebarItem
          icon={<FiPlusSquare size={24} />}
          text="Create"
          isActive={activeItem === "createPost"}
          onClick={() => {
            setActiveItem("createPost");
            onClick("createPost");
          }}
        />

        <SidebarItem
          icon={
            <CustomImage
              imgSrc={userProfile || fallbackImg}
              fallBack={fallbackImg}
              className={`w-6 h-6 rounded-full object-cover ${
                activeItem === "profile" ? "" : ""
              }`}
            />
          }
          text="Profile"
          isActive={activeItem === "profile"}
          onClick={() => {
            setActiveItem("profile");
            onClick("profile");
          }}
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
        {activeItem === "home" ? (
          <AiFillHome size={22} />
        ) : (
          <AiOutlineHome size={22} />
        )}
        <FiSearch size={22} />
        <FiPlusSquare size={22} />
        <RiMovieLine size={22} />
        {activeItem === "notifications" ? (
          <FaHeart size={22} />
        ) : (
          <FaRegHeart size={22} />
        )}
        <CustomImage
          imgSrc={userProfile || fallbackImg}
          fallBack={fallbackImg}
          className="w-6 h-6 rounded-full"
          onClick={() => {
            setActiveItem("profile");
            onClick("profile");
          }}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
