// SideBar.jsx - Updated with One Piece theme + Channel Support
import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AuthContex } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContex";
import toast from "react-hot-toast";

const SideBar = () => {
  const {
    users,
    channels,
    getUsers,
    getChannels,
    selectedUser,
    selectedChannel,
    setSelectedUser,
    setSelectedChannel,
    unseenMessages,
    setUnseenMessages,
    axios
  } = useContext(ChatContext);

  const { logout, onlineUsers, authUser } = useContext(AuthContex);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    getUsers();
    getChannels();
  }, [onlineUsers]);

  return (
    <div
      className={`bg-[rgba(210,180,140,0.95)] h-full p-4 overflow-y-auto border-r-4 border-yellow-700
      text-[#3B2F2F] ${selectedUser || selectedChannel ? "max-md:hidden" : ""}`}
    >
      {/* Crew Header */}
      <div className="pb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <img src={assets.logo} alt="logo" className="max-w-28 mx-auto mb-2" />
            <h1 className="text-yellow-700 font-bold text-lg font-[Pirata One]">
              Straw Hat Crew
            </h1>
          </div>

          <div className="relative group">
            <button className="p-2 bg-[#C04000] rounded-full hover:bg-[#A03000] transition-colors border-2 border-yellow-700">
              <img src={assets.menu_icon} alt="menu" className="w-5 filter invert" />
            </button>
            <div className="absolute top-full right-0 z-20 w-40 p-3 rounded-xl bg-[#C04000] border-2 border-yellow-700 text-white hidden group-hover:block shadow-xl">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm py-2 hover:text-yellow-300 transition-colors font-[Comic Sans MS]"
              >
                📜 Edit Wanted Poster
              </p>
              <hr className="my-2 border-t border-yellow-700" />
              <p
                onClick={logout}
                className="cursor-pointer text-sm py-2 hover:text-yellow-300 transition-colors font-[Comic Sans MS]"
              >
                ⚓ Leave Crew
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
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

     
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-yellow-700 font-bold text-lg font-[Pirata One]">
            Channels
          </h2>

          <button
            onClick={() => setShowCreateChannel(true)}
            className="px-2 py-1 bg-yellow-600 text-white rounded-lg text-xs border-2 border-yellow-900 hover:bg-yellow-700 transition"
          >
            + Add
          </button>
        </div>

        {/* Channel List */}
        <div className="space-y-2">
          {channels.map((ch) => (
            <div
              key={ch._id}
              onClick={() => {
                setSelectedUser(null);
                setSelectedChannel(ch);
              }}
              className={`relative p-3 rounded-lg cursor-pointer transition-all duration-300 border-2 
                ${
                  selectedChannel?._id === ch._id
                    ? "bg-yellow-200 border-[#C04000] scale-105 shadow-md"
                    : "bg-[#FFF5E1] border-transparent hover:bg-[#FFEAB0] hover:border-yellow-700"
                }`}
            >
              <p className="font-bold text-sm text-[#3B2F2F] flex items-center gap-2 font-[Comic Sans MS]">
                <span className="text-red-700 font-extrabold">#</span> {ch.name}
              </p>
            </div>
          ))}

          {channels.length === 0 && (
            <p className="text-center text-sm text-gray-700 font-[Comic Sans MS] opacity-80">
              No channels yet...
            </p>
          )}
        </div>
      </div>

      
      <div className="space-y-2 mt-8">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedChannel(null);
              setSelectedUser(user);
              if (unseenMessages[user._id] > 0) {
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              }
            }}
            className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 border-2 
              ${
                selectedUser?._id === user._id
                  ? "bg-yellow-200 border-[#C04000] scale-105 shadow-md"
                  : "bg-[#FFF5E1] border-transparent hover:bg-[#FFEAB0] hover:border-yellow-700"
              } shadow-sm`}
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-yellow-700 bg-transparent"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-yellow-700 ${
                  onlineUsers.includes(user._id)
                    ? "bg-green-400"
                    : "bg-gray-400"
                }`}
              ></div>
            </div>

            {/* User Info */}
            <div className="flex flex-col leading-5 flex-1 min-w-0">
              <p className="font-bold text-sm flex items-center gap-2 truncate font-[Comic Sans MS]">
                {user.fullName}
                {authUser?._id === user._id && (
                  <span className="text-xs px-2 py-1 rounded-full bg-[#C04000] text-yellow-200">
                    CAPTAIN
                  </span>
                )}
              </p>
              <span
                className={`text-xs font-bold ${
                  onlineUsers.includes(user._id)
                    ? "text-green-700"
                    : "text-gray-500"
                }`}
              >
                {onlineUsers.includes(user._id) ? "⚓ Sailing" : "💤 Ashore"}
              </span>
            </div>

            {/* Unseen messages */}
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

      {/* ================= CREATE CHANNEL MODAL ================= */}
      {showCreateChannel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#FFF5E1] border-4 border-yellow-800 rounded-2xl p-6 w-[90%] max-w-md shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            <h2 className="text-xl font-bold text-yellow-700 mb-4 font-[Pirata One]">
              ⚓ Create New Channel
            </h2>

            <input
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              type="text"
              placeholder="Channel name..."
              className="w-full p-3 border-2 border-yellow-700 rounded-lg bg-white text-[#3B2F2F] mb-4 font-[Comic Sans MS]"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateChannel(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg font-bold hover:bg-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!newChannelName.trim())
                    return toast.error("Enter a channel name!");

                  try {
                    const { data } = await axios.post("/api/channels", {
                      name: newChannelName,
                    });

                    if (data.success) {
                      toast.success("Channel created!");
                      getChannels();
                      setNewChannelName("");
                      setShowCreateChannel(false);
                    } else {
                      toast.error(data.message);
                    }
                  } catch (err) {
                    toast.error(err.message);
                  }
                }}
                className="px-4 py-2 bg-yellow-700 text-white rounded-lg font-bold hover:bg-yellow-800"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
