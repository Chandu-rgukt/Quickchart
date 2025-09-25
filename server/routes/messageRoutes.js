import express from "express"
import { protectedRoute } from "../middleware/auth.js"
import { getMessags, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/MessageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectedRoute, getUsersForSidebar);
messageRouter.get("/:id", protectedRoute, getMessags);
messageRouter.put("/mark/:id", protectedRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectedRoute, sendMessage)

export default messageRouter;