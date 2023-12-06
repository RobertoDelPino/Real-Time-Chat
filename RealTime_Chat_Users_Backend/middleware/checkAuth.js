import jwt from "jsonwebtoken";
import User from "../Models/User.js";

const checkAuth = async (req, res, next) => {
    let token = "";
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select(
                "-password -confirmed -createdAt -updatedAt -token -__v -confirmAccountToken -changePasswordToken"
            );
            next();
        } catch (error) {
            return res.status(404).json({message: "An error ocurred"})
        }
    };

    if(!token){
        const error = new Error("Not valid token");
        return res.status(401).json({error: error.message});
    }
}

export default checkAuth;