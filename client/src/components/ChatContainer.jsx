import React, { useEffect, useRef, useState, useContext } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContex";
import { AuthContex } from "../../context/AuthContext";
import MembersPanel from "../components/MembersPanel";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    message,
    users,
    selectedUser,
    selectedChannel,
    setSelectedUser,
    setSelectedChannel,
    sendMessage,
    sendChannelMessage,
    getMessages,
    getChannelMessages,
    addMemberToChannel,
    deleteChannel,
    page,
    setPage,
    hasMore,
    setHasMore
  } = useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContex);

  const [showMembers, setShowMembers] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);

  const [input, setInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setPage(1);
    setHasMore(true);

    if (selectedUser) getMessages(selectedUser._id, 1);
    if (selectedChannel) getChannelMessages(selectedChannel._id, 1);
  }, [selectedUser, selectedChannel]);

  useEffect(() => {
    if (page === 1 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  const handleScroll = async () => {
    if (!scrollRef.current) return;
    if (scrollRef.current.scrollTop !== 0) return;
    if (isFetching || !hasMore) return;

    setIsFetching(true);

    const oldHeight = scrollRef.current.scrollHeight;
    const nextPage = page + 1;
    setPage(nextPage);

    if (selectedUser) {
      await getMessages(selectedUser._id, nextPage);
    } else if (selectedChannel) {
      await getChannelMessages(selectedChannel._id, nextPage);
    }

    setTimeout(() => {
      const newHeight = scrollRef.current.scrollHeight;
      scrollRef.current.scrollTop = newHeight - oldHeight;
      setIsFetching(false);
    }, 100);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (selectedChannel) sendChannelMessage({ text: input.trim() });
    else sendMessage({ text: input.trim() });

    setInput("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleSendImage = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Yohoho! That's not a treasure map image!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      if (selectedChannel) sendChannelMessage({ image: reader.result });
      else sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleAddMember = async (userId) => {
    await addMemberToChannel(selectedChannel._id, userId);
    setShowAddMembers(false);
  };

  return selectedUser || selectedChannel ? (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-3 py-3 px-5 bg-[rgba(0,0,0,0.2)] backdrop-blur-md border-b border-yellow-400 flex-shrink-0">
        {selectedUser && (
          <>
            <div className="relative">
              <img
                src={selectedUser.profilePic || assets.avatar_icon}
                className="w-9 h-9 rounded-full border-2 border-yellow-400"
              />
              {onlineUsers.includes(selectedUser._id) && (
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
              )}
            </div>

            <p className="flex-1 text-lg font-bold text-yellow-400 flex items-center gap-2 font-[Comic Sans MS]">
              {selectedUser.fullName}
              <span className="text-xs bg-red-600 px-2 py-1 rounded-full text-white/90">
                Crew Mate
              </span>
            </p>

            <img
              onClick={() => setSelectedUser(null)}
              src={assets.arrow_icon}
              className="md:hidden w-7 cursor-pointer p-1 bg-red-600/70 rounded-full"
            />
          </>
        )}

        {selectedChannel && !selectedUser && (
          <>
            <div className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-yellow-400 bg-red-600/40">
              <span className="text-yellow-300 text-xl font-bold">#</span>
            </div>

            <p className="flex-1 text-lg font-bold text-yellow-400 flex items-center gap-2 font-[Comic Sans MS]">
              {selectedChannel.name}
              <span className="text-xs bg-blue-600 px-2 py-1 rounded-full text-white/90">
                Channel
              </span>
            </p>

            <button
              onClick={() => setShowMembers(true)}
              className="px-2 py-1 bg-blue-600 text-white text-xs rounded-lg border border-yellow-900 hover:bg-blue-700"
            >
              Members
            </button>

            <button
              onClick={() => setShowAddMembers(true)}
              className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-lg border border-yellow-900 hover:bg-yellow-700"
            >
              + Add Members
            </button>

            {selectedChannel && selectedChannel.createdBy === authUser._id && (
              <button
                onClick={() => deleteChannel(selectedChannel._id)}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded-lg border border-red-900 hover:bg-red-700"
              >
                Delete
              </button>
            )}

            <img
              onClick={() => setSelectedChannel(null)}
              src={assets.arrow_icon}
              className="md:hidden w-7 cursor-pointer p-1 bg-blue-600/70 rounded-full"
            />
          </>
        )}
      </div>

      <div
        className="flex-1 overflow-y-auto min-h-0 px-4 py-3 bg-transparent backdrop-blur-sm"
        onScroll={handleScroll}
        ref={scrollRef}
      >
        {message.map((msg, index) => {
          const isMe = msg.senderId === authUser._id;

          return (
            <div
              key={msg._id || index}
              className={`flex items-end gap-3 mb-3 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {msg.image ? (
                <div className={`relative ${isMe ? "text-right" : "text-left"}`}>
                  <img
                    src={msg.image}
                    className="max-w-[220px] rounded-lg border-2 border-yellow-400 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => window.open(msg.image)}
                  />
                  <div className="text-xs mt-1 text-white/70">
                    {formatMessageTime(msg.createdAt)}
                  </div>
                </div>
              ) : (
                <div className={`max-w-[70%] ${isMe ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block p-2 rounded-xl ${
                      isMe
                        ? "bg-red-600/50 text-yellow-400 border border-yellow-400 shadow-sm"
                        : "bg-yellow-400/30 text-[#3B2F2F] border border-yellow-400 shadow-sm"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.text}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-1 justify-end">
                    <img
                      src={
                        (isMe ? authUser?.profilePic : selectedUser?.profilePic) ||
                        assets.avatar_icon
                      }
                      className="w-5 h-5 rounded-full border-2 border-yellow-400"
                    />
                    <span className="text-xs text-white/70">
                      {isMe ? "You" : selectedUser?.fullName} •{" "}
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-3 p-3 bg-[rgba(0,0,0,0.15)] backdrop-blur-md border-t border-yellow-400 flex-shrink-0">
        <div className="flex-1 flex items-center px-3 rounded-full border-2 border-yellow-400 bg-black/10">
          <input
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            value={input}
            placeholder="Send a message in a bottle..."
            className="flex-1 text-sm p-2 border-0 outline-none text-white placeholder-yellow-200 bg-transparent"
          />

          <input onChange={handleSendImage} type="file" id="image" accept="image/*" hidden />
          <label htmlFor="image" className="cursor-pointer transform hover:scale-110 transition-transform">
            <img src={assets.gallery_icon} className="w-5 filter invert" />
          </label>
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!input.trim()}
          className={`p-2 rounded-full border-2 border-yellow-400 ${
            input.trim()
              ? "bg-red-600/70 hover:bg-red-700/70 transform hover:scale-105"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          <img src={assets.send_button} className="w-5 filter invert" />
        </button>
      </div>

      {showAddMembers && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[#FFF5E1] p-6 rounded-2xl border-4 border-yellow-700 w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-yellow-700 mb-3">Add Members</h2>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {users
                .filter((u) => !selectedChannel.members?.includes(u._id))
                .map((user) => (
                  <div
                    key={user._id}
                    className="p-2 bg-yellow-100 rounded-lg cursor-pointer hover:bg-yellow-200 border border-yellow-700"
                    onClick={() => handleAddMember(user._id)}
                  >
                    {user.fullName}
                  </div>
                ))}
            </div>

            <button
              onClick={() => setShowAddMembers(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showMembers && (
        <MembersPanel
          selectedChannel={selectedChannel}
          onClose={() => setShowMembers(false)}
        />
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full gap-4 bg-[rgba(26,13,46,0.8)]">
      <img src={assets.logo_icon} className="w-20 animate-bounce" />
      <p className="text-2xl font-bold text-yellow-400 font-[Comic Sans MS]">Ahoy Matey!</p>
      <p className="text-white text-center px-4">
        Select a crew member or channel to start your adventure!
      </p>
    </div>
  );
};

export default ChatContainer;
