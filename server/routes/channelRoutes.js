import express from "express";
import { protectedRoute } from "../middleware/auth.js";
import {
    createChannel,
    getChannels,
    joinChannel,
    leaveChannel,
    
    removeMember,
    deleteChannel,
    getChannelMessages
} from "../controllers/channelController.js";

const router = express.Router();


router.get("/", protectedRoute, getChannels);
router.post("/", protectedRoute, createChannel);
router.get("/:id/messages", protectedRoute, getChannelMessages);
router.post("/:id/join", protectedRoute, joinChannel);
router.post("/:id/leave", protectedRoute, leaveChannel);
router.post("/:id/remove", protectedRoute, removeMember);
router.delete("/:id", protectedRoute, deleteChannel);




export default router;
