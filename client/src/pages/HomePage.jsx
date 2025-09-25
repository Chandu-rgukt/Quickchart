import React, { useContext, useState } from "react";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { ChatContext } from "../../context/ChatContex";

const HomePage = () => {
   const {selectedUser} = useContext(ChatContext)

  return (
    <div className="w-full h-screen sm:px-[15%] sm:py-[5%] bg-[url('/luffy_bg.jpg')] bg-cover">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl
        overflow-hidden h-full relative grid 
        ${selectedUser 
          ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]" 
          : "md:grid-cols-2"
        }`}
      >
        <SideBar  />
        <ChatContainer/>
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;