import express from "express"
import userRouter from "./Routes/userRouter.js"
import messageRouter from "./Routes/messageRouter.js"
import chatRouter from "./Routes/chatRouter.js"
import connectToDB from "./config/db.js";
import dotenv from "dotenv"
import cors from "cors"

const app = express();
app.use(express.json())

dotenv.config();

connectToDB();

// CONFIGURAR CORS
const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin, callback){
        if(whitelist.includes(origin)){
            callback(null, true)
        }
        else{
            callback(new Error("Error de CORS"))
        }
    }
}

app.use(cors(corsOptions))

// Routes
app.use("/api/users", userRouter)
app.use("/api/messages", messageRouter)
app.use("/api/chats", chatRouter)

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

// Socket IO
import { Server } from "socket.io"

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
});


io.on("connection", (socket) => {
    console.log("connected")
    // Define events

    socket.on("Connected User", (userId) => {
        if(userId != null){
            socket.join(userId)
        }
    })

    socket.on("Send Message", (message) => {
        const sender = message.sender;
        const receiver = message.receiver;
        socket.to(receiver).to(sender).emit("Message sent", message)
    })

    // Cuando llegue este mensaje se publicará un mensaje para el receiver y el sender
    // y se enviará un mensaje con el chat actualizado con su último mensaje
    socket.on("Update Messages Status", (message) => {
        const sender = message.sender;
        const receiver = message.receiver;
        message.readed = true;
        socket.to(receiver).to(sender).emit("Message Chat Status Updated", message)
    })
})