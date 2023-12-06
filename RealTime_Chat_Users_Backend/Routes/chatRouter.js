import express from "express"
import checkAuth from "../middleware/checkAuth.js";
import { 
    createChat, 
    deleteChat, 
    getChat, 
    getChatByUsers, 
    getChats
} from "../Controllers/chatController.js";

const router = express.Router();

router.get("/", checkAuth, getChats)
router.get("/:id", checkAuth, getChat)
router.get("/get/:user1/:user2", checkAuth, getChatByUsers)
router.post("/create", checkAuth, createChat)
router.delete("/delete/:id", checkAuth, deleteChat)

export default router