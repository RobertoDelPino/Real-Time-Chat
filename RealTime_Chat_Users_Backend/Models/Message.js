import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    readTime: {
        type: Date,
        default: null
    },
    readed: { 
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

const Message = mongoose.model("Message", messageSchema)
export default Message;