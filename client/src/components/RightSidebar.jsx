// RightSidebar.jsx - Updated with One Piece theme
import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { AuthContex } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContex'

const RightSidebar = () => {
  const { selectedUser, message } = useContext(ChatContext)
  const {logout, onlineUsers, authUser } = useContext(AuthContex);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(()=>{
    setMsgImages(message.filter(msg=>msg.image).map(msg=>msg.image))
  },[message])

  return selectedUser && (
  <div className="relative bg-[rgba(26,13,46,0.85)] text-white h-full overflow-y-auto p-3 pb-20 border-l-4 border-red-500">
  {/* Wanted Poster Section */}
  <div className="flex flex-col items-center gap-3 mb-5 p-3 rounded-xl border-2 border-yellow-400 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm">
    <div className="relative">
      <img
        src={selectedUser?.profilePic || assets.avatar_icon}
        alt="Profile"
        className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400 bg-transparent"
      />
      <div className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 text-[10px] px-1 py-[2px] rounded-full font-bold rotate-12">
        {onlineUsers.includes(selectedUser._id) ? 'ONLINE' : 'OFFLINE'}
      </div>
    </div>

    <h1 className="text-lg font-bold text-yellow-400 flex items-center gap-2 font-[Comic Sans MS]">
      {selectedUser.fullName}
      {authUser?._id === selectedUser?._id && (
        <span className="text-[10px] px-2 py-1 rounded-full bg-yellow-400 text-red-600 font-bold">CAPTAIN</span>
      )}
    </h1>

    <p className="text-xs text-center text-white bg-[rgba(0,0,0,0.3)] px-2 py-1 rounded-md">
      {selectedUser.bio || "Yohoho! I'm sailing with ChatWave!"}
    </p>
  </div>

  <div className="w-full h-1 bg-yellow-400 rounded-full my-4"></div>

  {/* Treasure Maps Gallery */}
  <div className="px-1">
    <h2 className="text-md font-bold mb-3 text-yellow-400 flex items-center gap-2 font-[Comic Sans MS]">
      <span className="text-xl">🗺️</span> Treasure Maps
    </h2>
    <div className="grid grid-cols-3 gap-2">
      {msgImages.map((url, index) => (
        <div
          key={index}
          onClick={() => window.open(url)}
          className="cursor-pointer rounded-md overflow-hidden transition-all duration-200 hover:scale-105 border-2 border-yellow-400"
        >
          <img
            src={url}
            alt="Treasure Map"
            className="w-full h-16 object-cover"
          />
        </div>
      ))}
      {msgImages.length === 0 && (
        <div className="col-span-3 text-center py-3 text-gray-400">
          <span className="text-3xl">🏴‍☠️</span>
          <p className="text-xs mt-1">No treasure maps yet!</p>
        </div>
      )}
    </div>
  </div>

  {/* Abandon Ship Button */}
  <button
    onClick={logout}
    className="absolute bottom-5 left-1/2 transform -translate-x-1/2 
    bg-red-600 hover:bg-red-700 text-yellow-400 font-bold 
    text-xs py-2 px-6 rounded-full cursor-pointer border-2 border-yellow-400
    hover:scale-105 transition-all font-[Comic Sans MS] shadow-md"
  >
    🏴‍☠️ Abandon Ship
  </button>
</div>


  )
}

export default RightSidebar