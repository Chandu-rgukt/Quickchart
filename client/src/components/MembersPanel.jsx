import React, { useContext } from "react";
import assets from "../assets/assets.js";
import { ChatContext } from "../../context/ChatContex";
import { AuthContex } from "../../context/AuthContext";

const MembersPanel = ({ selectedChannel, onClose }) => {
  const { onlineUsers, authUser } = useContext(AuthContex);
  const { removeMemberFromChannel, leaveChannel } = useContext(ChatContext);

  const isCreator = selectedChannel?.createdBy === authUser?._id;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#FFF5E1] p-6 rounded-2xl border-4 border-yellow-700 w-[90%] max-w-md">

        <h2 className="text-xl font-bold text-yellow-700 mb-4">Crew Members</h2>

        <div className="max-h-72 overflow-y-auto space-y-3">
          {selectedChannel?.members?.map(member => (
            <div
              key={member._id}
              className="flex items-center justify-between p-2 bg-yellow-100 rounded-lg border border-yellow-700"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.profilePic || assets.avatar_icon}
                  className="w-9 h-9 rounded-full border-2 border-yellow-700"
                />

                <div className="flex flex-col">
                  <p className="font-bold">{member.fullName}</p>
                  <span className="text-xs">
                    {selectedChannel.createdBy === member._id
                      ? "👑 Captain"
                      : onlineUsers.includes(member._id)
                      ? "⚓ Sailing"
                      : "💤 Ashore"}
                  </span>
                </div>
              </div>

              {isCreator && member._id !== authUser._id && (
                <button
                  onClick={() =>
                    removeMemberFromChannel(selectedChannel._id, member._id)
                  }
                  className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <button
  onClick={async () => {
    await leaveChannel(selectedChannel._id);
    onClose(); // THIS FIXES YOUR PROBLEM
  }}
  className="mt-4 px-4 py-2 w-full bg-red-600 text-white rounded-lg hover:bg-red-700"
>
  Leave Channel
</button>


        <button
          onClick={onClose}
          className="mt-3 px-4 py-2 w-full bg-gray-600 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MembersPanel;
