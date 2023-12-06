import useAuth from "../hooks/useAuth"
import useChat from "../hooks/useChat"
import Logout from "./Logout";
import PersonalUserPhoto from "./PersonalUserPhoto";
import StartChat from "./StartChat";
import UserPhoto from "./UserPhoto";

const PrevisualizeChats = () => {
    const { chats, isLoading, selectedChat ,setSelectedChat, chatsWithNewMessages, updateMessagesStatus, removeChatWithNewMessages } = useChat();
    const { auth, getProfilePhoto, changePhoto } = useAuth();
    
    const handleSelectChat = async (chat) => {
        await updateMessagesStatus(chat)
        setSelectedChat(chat)
        removeChatWithNewMessages(chat._id)
    }
 
    if(isLoading)
        return <div>Cargando</div> 

    return  (
            <article className="w-full h-full flex flex-col border-black border-r ">
                <StartChat/>
                <div className="">
                    {
                        Object.keys(chats).length == 0 || chats.length == 0
                        ? <div>Comience una nueva conversacion</div> 
                        : (
                            chats.map((chat) => {
                                return chat.users.map( (user, index) => {
                                    if(user._id != auth._id){
                                        return chat.messages.length == 0
                                        ? "" 
                                        :   <article 
                                                className={"border-b border-slate-600 p-2 flex gap-5 items-center hover:cursor-pointer hover:bg-gray-200 w-11/12 mx-auto " + (selectedChat._id == chat._id ? "bg-gray-200" : "")} 
                                                onClick={() => handleSelectChat(chat)}
                                                key={index}>
                                                    <UserPhoto user={user} getProfilePhoto={getProfilePhoto}/>
                                                    <section className="w-3/4">
                                                        <p className="font-bold text-lg">{user.name} </p>
                                                        <section className="flex justify-between gap-2">
                                                            <p className="inline-block w-4/6 max-w-[200px] whitespace-nowrap overflow-hidden">
                                                                {chat.messages[0].message }
                                                            </p>
                                                            <p className="inline-block w-2/6 whitespace-nowrap">
                                                                {chat.messages[0].readed ? "Leido" : "No Leido"}
                                                            </p>
                                                        </section>
                                                    </section>

                                                    <section className="w-1/4 flex justify-center items-center">
                                                    {
                                                        (chatsWithNewMessages.includes(chat._id) || 
                                                            (!chat.messages[0].readed && chat.messages[0].sender != auth._id)) && (
                                                                <div className="w-8 h-8 rounded-full bg-red-500"></div>
                                                        )
                                                    }
                                                    </section>
                                            </article>
                                    }
                                })
                            })
                        )
                    }
                </div>
                <section className="mt-auto border-t border-black flex justify-between">
                    {
                    /* 
                        Esto va a ser la imagen del usuario, si la cicla (será un boton para seleccionar una imagen),
                        se llamará a la api para cambiar la imagen y se establece el nuevo valor en el estado del usuario
                    */
                    }
                    <PersonalUserPhoto user={auth} getProfilePhoto={getProfilePhoto} changePhoto={changePhoto}/>
                    <Logout/>
                </section>
            </article>
        )
}

export default PrevisualizeChats