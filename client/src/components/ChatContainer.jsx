
import React, { useEffect, useRef, useState, useContext } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContex';
import { AuthContex } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const {message, selectedUser, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext);
  const {authUser, onlineUsers} = useContext(AuthContex);
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState('');

  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current && message) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input.trim() });
      setInput('');
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleSendImage = (e) =>{
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")) {
      toast.error("Yohoho! That's not a treasure map image!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({image: reader.result})
      e.target.value = "";
    }
    reader.readAsDataURL(file);
  }

  return selectedUser ? (
    <div className="flex flex-col h-full min-h-0">
  {/* Header */}
  <div className="flex items-center gap-3 py-3 px-5 bg-[rgba(0,0,0,0.2)] backdrop-blur-md border-b border-yellow-400 flex-shrink-0">
    <div className="relative">
      <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-9 h-9 rounded-full border-2 border-yellow-400 bg-transparent" />
      {onlineUsers.includes(selectedUser._id) && (
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
      )}
    </div>
    <p className="flex-1 text-lg font-bold text-yellow-400 flex items-center gap-2 font-[Comic Sans MS]">
      {selectedUser.fullName || "Unknown Pirate"}
      <span className="text-xs bg-red-600 px-2 py-1 rounded-full text-white/90">Crew Mate</span>
    </p>
    <img
      onClick={() => setSelectedUser(null)}
      src={assets.arrow_icon}
      alt=""
      className="md:hidden w-7 cursor-pointer transform hover:scale-110 transition-transform p-1 bg-red-600/70 rounded-full"
    />
  </div>

  {/* Messages */}
  <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 bg-transparent backdrop-blur-sm">
    {message.map((msg, index) => {
      const isMe = msg.senderId === authUser._id;
      return (
        <div key={msg._id || index} className={`flex items-end gap-3 mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
          {msg.image ? (
            <div className={`relative ${isMe ? 'text-right' : 'text-left'}`}>
              <img
                src={msg.image}
                alt="Treasure Map"
                className={`max-w-[220px] rounded-lg border-2 border-yellow-400 shadow-sm hover:scale-105 transition-transform cursor-pointer`}
                onClick={() => window.open(msg.image)}
              />
              <div className={`text-xs mt-1 text-white/70 ${isMe ? 'text-right' : 'text-left'}`}>
                {formatMessageTime(msg.createdAt)}
              </div>
            </div>
          ) : (
            <div className={`max-w-[70%] ${isMe ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-xl ${
                isMe
                  ? 'bg-red-600/50 text-yellow-400 border border-yellow-400 shadow-sm'
                  : 'bg-yellow-400/30 text-[#3B2F2F] border border-yellow-400 shadow-sm'
              }`}>
                <p className="text-sm break-words">{msg.text}</p>
              </div>
              <div className="flex items-center gap-2 mt-1 justify-end">
                <img
                  src={isMe ? authUser?.profilePic || assets.avatar_icon : selectedUser.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-5 h-5 rounded-full border-2 border-yellow-400 bg-transparent"
                />
                <span className="text-xs text-white/70">
                  {isMe ? 'You' : selectedUser.fullName} • {formatMessageTime(msg.createdAt)}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    })}
    <div ref={messagesEndRef} />
  </div>

  {/* Input */}
  <div className="flex items-center gap-3 p-3 bg-[rgba(0,0,0,0.15)] backdrop-blur-md border-t border-yellow-400 flex-shrink-0">
    <div className="flex-1 flex items-center px-3 rounded-full border-2 border-yellow-400 bg-black/10">
      <input
        onChange={(e)=> setInput(e.target.value)}
        onKeyDown={(e)=> e.key === 'Enter' ? handleSendMessage(e): null}
        value={input}
        type="text"
        placeholder="Send a message in a bottle..."
        className="flex-1 text-sm p-2 border-0 rounded-lg outline-none text-white placeholder-yellow-200 bg-transparent"
      />
      <input onChange={handleSendImage} type="file" id="image" accept="image/png, image/jpeg" hidden />
      <label htmlFor="image" className="cursor-pointer transform hover:scale-110 transition-transform">
        <img src={assets.gallery_icon} alt="Send Treasure Map" className="w-5 filter invert" />
      </label>
    </div>
    <button 
      type="button"
      onClick={handleSendMessage}
      disabled={!input.trim()}
      className={`p-2 rounded-full border-2 border-yellow-400 ${
        input.trim() 
          ? 'bg-red-600/70 hover:bg-red-700/70 transform hover:scale-105' 
          : 'bg-gray-600 cursor-not-allowed'
      } transition-all`}
    >
      <img src={assets.send_button} alt="Set Sail" className="w-5 filter invert" />
    </button>
  </div>
</div>


  ) : (
    <div className="flex flex-col items-center justify-center h-full gap-4 bg-[rgba(26,13,46,0.8)]">
      <div className="relative">
        <img src={assets.logo_icon} alt="" className="w-20 animate-bounce" />
        <div className="absolute -inset-4 bg-yellow-400 rounded-full blur-lg opacity-30"></div>
      </div>
      <p className="text-2xl font-bold text-yellow-400 font-[Comic Sans MS]">Ahoy Matey!</p>
      <p className="text-white text-center px-4">Select a crew member to start your adventure!</p>
      <div className="flex gap-2 mt-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
      </div>
    </div>
  );
};

export default ChatContainer;