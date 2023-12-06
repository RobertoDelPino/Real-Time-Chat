import express from "express"
import { 
    changePassword, 
    checkPasswordToken, 
    confirmAccount, 
    findUser, 
    forgotPassword, 
    getProfile, 
    getProfilePhoto, 
    login, 
    registerUser, 
    uploadPhoto
} from "../Controllers/userController.js"
import checkAuth from "../middleware/checkAuth.js";
import { upload } from "../middleware/uploadPhoto.js";

const router = express.Router();

router.post("/login", login)
router.post("/register", registerUser)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", changePassword)
router.post("/check-password-token/:token", checkPasswordToken)
router.get("/confirm/:token", confirmAccount)
router.get("/profile", checkAuth, getProfile)
router.get("/find/:email", checkAuth, findUser)
router.post("/upload-avatar", [checkAuth, upload.single("file")], uploadPhoto)
router.get("/profile-photo/:userId", checkAuth, getProfilePhoto)

export default router