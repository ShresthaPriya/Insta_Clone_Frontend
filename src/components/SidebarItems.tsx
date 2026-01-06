import React from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  onClick,
  isActive,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-4 rounded-xl cursor-pointer transition
        hover:bg-gray-100
        ${isActive ? "font-bold text-black" : "text-gray-800"}`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default SidebarItem;
