import Chat from "../Models/Chat.js";
import Message from "../Models/Message.js";

const createChat = async (req, res) => {
    const chat = new Chat(req.body)
    chat.save();
    res.json("creando chat: " + chat)
}

const getChats = async (req, res) => {
    const { _id } = req.user;
    const chats = await Chat.find({users: _id})
                            .select({messages: { $slice: -1 }})
                            .select("-createdAt -updatedAt -__v")
                            .populate({path: "messages", select: "_id readed message sender"})
                            .populate({path: "users", select: "-password -confirmed -createdAt -updatedAt -token -__v -confirmAccountToken -changePasswordToken"})
    res.json(chats)
}

const getChat = async (req, res) => {
    const { id } = req.params;
    const chats = await Chat.findById(id)
                            .select({messages: { $slice: -100 }})
                            .select("-__v -createdAt -updatedAt")
                            .populate({path: "messages", select: "_id readed message sender createdAt"})
                            .populate({path: "users", select: "_id name email"})
    res.json(chats)
}

const deleteChat = async (req, res) => {
    try{
        const { id } = req.params;
        const chat = await Chat.findById(id)
                                .select("messages");
        
        await Message.deleteMany({_id: {$in: chat.messages}})
        await Chat.deleteOne({_id: id})
        res.json({message: "Chat successfully deleted"})
    }catch(error){
        res.json({message: "An error ocurred while deleting the chat", error})
    }
}

const getChatByUsers = async (req, res) => {
    const { user1, user2 } = req.params;
    const chat = await Chat.findOne({ users: { $all: [user1, user2] } });
    
    if (!chat) {
        const newChat = new Chat({ users: [user1, user2] });
        await newChat.save();
        res.json({chatId: newChat._id, users: newChat.users})
        return;
    }
    
    res.json({chatId: chat._id, users: chat.users})
}

export {
    createChat,
    getChats,
    getChat,
    deleteChat,
    getChatByUsers
}