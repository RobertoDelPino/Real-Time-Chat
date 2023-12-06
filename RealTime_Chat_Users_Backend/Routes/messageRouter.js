import express from "express"
import { 
    deleteMessage, 
    editMessage, 
    sendMessage,
    updateStatus
} from "../Controllers/messageController.js"
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/send", checkAuth, sendMessage)
router.post("/edit/:id", checkAuth, editMessage)
router.post("/delete/:id", checkAuth, deleteMessage)
router.post("/updateStatus", checkAuth, updateStatus)

export default router