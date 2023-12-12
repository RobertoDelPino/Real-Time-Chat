import User from "../Models/User.js"
import generateId from "../helpers/generateId.js"
import generateJWT from "../helpers/generateJWT.js"
import { confirmAccountEmail, forgotPasswordGenerateToken } from "../helpers/sendEmails.js"
import fs from "fs"
import path from "path"

const registerUser = async (req, res) => {
    const { email } = req.body    
    const userExists = await User.findOne({email})

    if(userExists){
        const error = new Error("User already exists")
        return res.status(404).json({message: error.message})
    }

    try {
        const user = new User(req.body);
        user.confirmAccountToken = generateId();
        await user.save();
        confirmAccountEmail({
            email: user.email,
            name: user.name,
            token: user.confirmAccountToken
        })
        res.json({message: "Successfully registered user. Check your email to confirm account"})    
    } catch (error) {
        const errorCreation = new Error("Error during creation of user")
        return res.status(404).json({message: errorCreation.message})
    }
}

const confirmAccount = async (req, res) => {
    const {token} = req.params;

    const user = await User.findOne({confirmAccountToken: token})

    if(!user){
        const error = new Error("User does not exist")
        return res.status(404).json({message: error.message})
    }

    user.confirmed = true;
    user.confirmAccountToken = "";
    user.save();

    res.json({message: "User have been successfully confirmed"})
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});
    if(!user){
        const error = new Error("User does not exist")
        return res.status(404).json({message: error.message})
    }

    if(!user.confirmed){
        const error = new Error("User is not confirmed")
        return res.status(404).json({message: error.message})
    }

    if(await user.checkPassword(password)){
        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateJWT(user._id)
        });
    }
    else{
        const error = new Error("Password is not correct");
        return res.status(400).json({error: error.message});
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({email});
    if(!user){
        const error = new Error("User with given email does not exist")
        return res.status(404).json({message: error.message})
    }

    user.changePasswordToken = generateId();
    await forgotPasswordGenerateToken(user)
    user.save();
    res.json({message: "Check your email. We have just send you a link to change your password"})
}

const changePassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({changePasswordToken: token})
    if(!user){
        const error = new Error("User do not exist")
        return res.status(404).json({message: error.message})
    }

    user.password = newPassword;
    user.changePasswordToken = "";
    user.save();
    res.json({message: "Password successfully changed"})
}

const checkPasswordToken = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({changePasswordToken: token})

    if(!user){
        const error = new Error("Not valid token")
        return res.status(404).json({message: error.message})
    }

    res.json({message: "Token is valid"})
} 

const getProfile = async (req, res) => {
    res.json(req.user)
}

const findUser = async (req, res) => {
    const { email } = req.params;
    const user = await User
                        .findOne({email})
                        .select( "-password -confirmed -createdAt -updatedAt -token -__v -confirmAccountToken -changePasswordToken -avatar")

    if(!user){
        const error = new Error("User does not exist")
        return res.status(404).json({message: error.message})
    }

    res.json(user)
}

const uploadPhoto = async (req, res) => {
    const user = await User.findOne({_id: req.user._id})
    const oldAvatar = user.avatar.replace("\\", "/")

    if(oldAvatar !== "UserPhotos/defaultAvatar.jpg"){
        fs.unlink(oldAvatar, (err) => {
            if (err) {console.error(err); return}
        })
    }

    user.avatar = req.file.path;
    user.save();
    res.status(200).json({ message: 'Foto subida con éxito' });
}

const getProfilePhoto = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findOne({_id: userId})
    if(!user){
        const error = new Error("User does not exist")
        return res.status(404).json({message: error.message})
    }
    if(user.avatar === "UserPhotos/defaultAvatar.jpg"){
        const defaultAvatar = path.resolve("UserPhotos/defaultAvatar.jpg")
        return res.sendFile(defaultAvatar)
    }
    const userAvatar = path.resolve(user.avatar.replace("\\", "/"))
    if(!userAvatar){
        const defaultAvatar = path.resolve("UserPhotos/defaultAvatar.jpg")
        return res.sendFile(defaultAvatar)
    }
    return res.sendFile(userAvatar)
}

export {
    registerUser,
    confirmAccount,
    login,
    forgotPassword,
    changePassword,
    checkPasswordToken,
    getProfile,
    findUser,
    uploadPhoto,
    getProfilePhoto
}