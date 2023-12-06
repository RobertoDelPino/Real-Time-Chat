import Chat from "../Models/Chat.js";
import Message from "../Models/Message.js";
import { Types } from "mongoose";
const { ObjectId } = Types;

const sendMessage = async (req, res) => {
    try {
        let { chatId } = req.body;
        let chat = {};
        if( chatId === undefined || chatId === null || chatId === "") {
            chatId = new ObjectId();
        }
        chat = await Chat.findById(chatId);
        if(!chat){
            const { sender, receiver } = req.body;
            const users = [sender, receiver];
            
            chat = new Chat({users});
            await chat.save();
        }

        const message = new Message(req.body);
        await message.save();
        chat.messages = [...chat.messages, message._id];
        await chat.save();
        res.json({
            id: message._id,
            sender: message.sender,
            createdAt: message.createdAt,
            message: message.message,
            readed: message.readed
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while sending the message.' });
    }
}

const editMessage = (req, res) => {
    res.json("editando mensaje")
}

const deleteMessage = (req, res) => {
    res.json("eliminando mensaje")
}

const updateStatus = async (req, res) => {
    const { chatId, userId } = req.body;
    const chat = await Chat.findById(chatId)
                            .select("messages");

    await Message.updateMany({_id: {$in: chat.messages}, sender: userId}, {readed: true})
    res.json({message: "Messages status updated"})
}



export {
    sendMessage,
    editMessage,
    deleteMessage,
    updateStatus
}