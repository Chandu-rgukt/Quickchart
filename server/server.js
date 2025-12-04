import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import Message from "./models/Message.js";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: { origin: "*" }
});

export const userSocketMap = {};

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => res.send("Server is alive"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/channels", channelRoutes);

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("joinChannel", (channelId) => {
        socket.join(channelId);
    });

    socket.on("sendChannelMessage", async ({ channelId, message }) => {
        try {
            const newMsg = await Message.create({
                senderId: userId,
                channelId,
                text: message.text || "",
                image: message.image || null,
            });

            io.to(channelId).emit("newChannelMessage", newMsg);
        } catch (error) {}
    });

    socket.on("channel:memberAdded", ({ channelId, userId }) => {
        io.emit("channel:updateMembers", { channelId, userId, action: "add" });
    });

    socket.on("channel:memberRemoved", ({ channelId, userId }) => {
        io.emit("channel:updateMembers", { channelId, userId, action: "remove" });
    });

    socket.on("channel:left", ({ channelId, userId }) => {
        io.emit("channel:updateMembers", { channelId, userId, action: "leave" });
    });

    socket.on("channel:deleted", ({ channelId }) => {
        io.emit("channel:removed", { channelId });
    });
});

await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log("Server running on port:", PORT);
});

export default server;
