// SideBar.jsx - Updated with One Piece theme
import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AuthContex } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContex';

const SideBar = () => {
  const { users, selectedUser, getUsers, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext)
  const { logout, onlineUsers, authUser } = useContext(AuthContex);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(()=>{
    getUsers();
  },[onlineUsers])

  return (
  <div className={`bg-[rgba(210,180,140,0.95)] h-full p-4 overflow-y-auto border-r-4 border-yellow-700
  text-[#3B2F2F] ${selectedUser ? "max-md:hidden" : ""}`}>
  
  {/* Crew Header */}
  <div className="pb-6">
    <div className="flex justify-between items-center mb-4">
      <div className="text-center">
        <img src={assets.logo} alt="logo" className="max-w-28 mx-auto mb-2" />
        <h1 className="text-yellow-700 font-bold text-lg font-[Pirata One]">Straw Hat Crew</h1>
      </div>
      <div className="relative group">
        <button className="p-2 bg-[#C04000] rounded-full hover:bg-[#A03000] transition-colors border-2 border-yellow-700">
          <img src={assets.menu_icon} alt="menu" className="w-5 filter invert" />
        </button>
        <div className="absolute top-full right-0 z-20 w-40 p-3 rounded-xl bg-[#C04000] border-2 border-yellow-700 text-white hidden group-hover:block shadow-xl">
          <p onClick={() => navigate('/profile')} className="cursor-pointer text-sm py-2 hover:text-yellow-300 transition-colors font-[Comic Sans MS]">
            📜 Edit Wanted Poster
          </p>
          <hr className="my-2 border-t border-yellow-700" />
          <p onClick={logout} className="cursor-pointer text-sm py-2 hover:text-yellow-300 transition-colors font-[Comic Sans MS]">
            ⚓ Leave Crew
          </p>
        </div>
      </div>
    </div>

    {/* Search - Looking Glass */}
    <div className="bg-[#F4E1B0] rounded-full flex items-center gap-3 py-2 px-4 border-2 border-yellow-700 shadow-inner">
      <span className="text-yellow-700 text-lg">🔍</span>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-transparent border-none outline-none text-[#3B2F2F] placeholder-[#A37C27] flex-1 font-[Comic Sans MS]"
        placeholder="Search for pirates..."
      />
    </div>
  </div>

  {/* Crew List */}
  <div className="space-y-2">
    {filteredUsers.map((user, index) => (
      <div
        key={index}
        onClick={() => {
          setSelectedUser(user);
          if (unseenMessages[user._id] > 0) {
            setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
          }
        }}
        className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 border-2 
          ${selectedUser?._id === user._id 
            ? "bg-yellow-200 border-[#C04000] scale-105 shadow-md" 
            : "bg-[#FFF5E1] border-transparent hover:bg-[#FFEAB0] hover:border-yellow-700"} shadow-sm`}
      >
        {/* Crew Member Avatar */}
        <div className="relative">
          <img 
            src={user?.profilePic || assets.avatar_icon}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-yellow-700 bg-transparent"
          />
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-yellow-700 ${
            onlineUsers.includes(user._id) ? 'bg-green-400' : 'bg-gray-400'
          }`}></div>
        </div>
        
        {/* Crew Member Info */}
        <div className="flex flex-col leading-5 flex-1 min-w-0">
          <p className="font-bold text-sm flex items-center gap-2 truncate font-[Comic Sans MS]">
            {user.fullName}
            {authUser?._id === user._id && (
              <span className="text-xs px-2 py-1 rounded-full bg-[#C04000] text-yellow-200">CAPTAIN</span>
            )}
          </p>
          <span className={`text-xs font-bold ${
            onlineUsers.includes(user._id) 
              ? 'text-green-700' 
              : 'text-gray-500'
          }`}>
            {onlineUsers.includes(user._id) ? '⚓ Sailing' : '💤 Ashore'}
          </span>
        </div>

        {/* Message Count Badge */}
        {unseenMessages[user._id] > 0 && (
          <div className="bg-[#C04000] text-yellow-200 text-xs font-bold h-5 w-5 flex justify-center items-center rounded-full border-2 border-yellow-700 animate-pulse">
            {unseenMessages[user._id]}
          </div>
        )}
      </div>
    ))}

    {filteredUsers.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        <span className="text-3xl">🏴‍☠️</span>
        <p className="text-sm mt-2 font-[Comic Sans MS]">No pirates found!</p>
      </div>
    )}
  </div>
</div>

  );
};

export default SideBar;