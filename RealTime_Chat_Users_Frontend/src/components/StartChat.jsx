/*
    ¿Cómo deberia de ser?
    1. Buscar un usuario por el email
    2. Si se encuentra, preguntar si se quiere iniciar una conversación, si pulsa si, se crea en la base de datos
    3. Si no se encuentra, mostrar mensaje de error
*/

import { useState } from "react";
import useChat from "../hooks/useChat";
import useAuth from "../hooks/useAuth";

const StartChat = () => {

    const { findUser, setChatOnPage, findChatId, getChatMessages, setChats, chats } = useChat();
    const { auth } = useAuth();

    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const getUserInfo = async () => {
        const connectedUserId = auth._id
        try {
            const userResult = await findUser(email);

            if(userResult.data._id == connectedUserId){
                setErrorMessage("No puedes iniciar una conversación contigo mismo")
                document.getElementById("errorMessage").classList.remove("hidden")
                return
            }

            const findChatResult = await findChatId(connectedUserId, userResult.data._id)

            if(findChatResult.data.chatId){
                const chatId = findChatResult.data.chatId
                const users = findChatResult.data.users
                setChats([...chats, {_id: chatId, users: users, messages: []}])
                await getChatMessages(chatId)
                setEmail("")
                return
            }

            const users = [{_id: userResult.data._id}, {_id: connectedUserId}]
            setChatOnPage({
                _id: "",
                users: users,
                messages: []
            })

            setEmail("")
        } catch (error) {
            console.log(error)
            if(error.response.status == 404){
                setErrorMessage("No se ha encontrado ningun usuario con ese email")
                document.getElementById("errorMessage").classList.remove("hidden")
                return
            }
        }
    }

  return (
    <section className="">
        <section className="w-11/12 m-auto relative flex items-center border rounded border-black my-2">
            <input 
                className="w-full p-3 " 
                type="text" 
                placeholder="Introduce un email para añadir un contacto"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button 
                className="bg-zinc-700 text-white hover:text-slate-300 p-3 right-0 -top-px"
                onClick={getUserInfo}
            >Buscar
            </button>
        </section>
        
        <p id="errorMessage" className="hidden">{errorMessage}</p>
    </section>
    
  )
}

export default StartChat