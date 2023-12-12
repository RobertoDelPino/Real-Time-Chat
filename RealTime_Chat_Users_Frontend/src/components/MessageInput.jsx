import useChat from "../hooks/useChat"
import useAuth from "../hooks/useAuth"
import { useState } from "react";

const MessageInput = () => {

    const { chatOnPage, sendMessage } = useChat();
    const { auth } = useAuth();

    const [message, setMessage] = useState("");

    const handleSubmit = async () => {

        if(message == ""){
            alert("Debe escribir un mensaje para poder enviarlo")
            return // Hay que mostrar alerta o algo para indicar que es necesario escribir algo
        }

        const messageInfo = {
            message,
            chatId: chatOnPage._id,
            sender: auth._id,
            users: chatOnPage.users,
            receiver: chatOnPage.users.find(user => user._id != auth._id)._id
        }

        await sendMessage(messageInfo)
        setMessage("")
    }

  return (
    <section className="bg-gray-100 h-18 w-full lg:w-4/6 fixed bottom-0 flex justify-center items-center border-t border-black">
        <textarea 
            className="m-2 border border-black w-9/12 p-1 resize-none"  
            placeholder="Empieza a escribir"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
        />
        <button 
            onClick={handleSubmit}
            className="w-2/12 border border-black"
        >Enviar
        </button>
    </section>
  )
}

export default MessageInput