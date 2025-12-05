import React from 'react'
import { FiHome, FiPlusSquare, FiHeart, FiSearch, FiUser } from "react-icons/fi";
import insta_logo from "../assets/Vector.png"

interface SidebarProps {
    onClick: (page: string) => void;
}

const Sidebar : React.FC<SidebarProps> = ({ onClick }) =>{
  return (
    <header className='flex '>
        <nav className="flex flex-col gap-8 border-r-6">
            <div className="w-32 px-4 py-2">
                <img src={insta_logo} alt='Instagram Logo'/>
            </div>
           
<div 
    onClick={() => onClick('home')}
    className="flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2 hover:bg-gray-200/40"
  >
    <FiHome size={24} />
    <span>Home</span>
  </div>
<div 
    onClick={() => onClick('home')}
    className="flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2 hover:bg-gray-200/40"
  >
    <FiHeart size={24} />
    <span>Notification</span>
  </div>
<div 
    onClick={() => onClick('home')}
    className="flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2 hover:bg-gray-200/40"
  >
    <FiPlusSquare size={24} />
    <span>Create</span>
  </div>
<div 
    onClick={() => onClick('home')}
    className="flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2 hover:bg-gray-200/40"
  >
    <FiSearch size={24} />
    <span>Search</span>
  </div>
 <div 
    onClick={() => onClick('home')}
    className="flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2 hover:bg-gray-200/40"
  >
    <FiUser size={24} />
    <span>Profile</span>
  </div>
                
            
            
        </nav>
      
    </header>
  )
}

export default Sidebar
