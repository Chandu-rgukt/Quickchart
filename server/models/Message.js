import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // For private chat
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // For channel chat
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },

    text: { type: String },
    image: { type: String },
    seen: { type: Boolean, default: false },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
