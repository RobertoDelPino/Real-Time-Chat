import { useEffect, useRef } from "react";
import useChat from "../hooks/useChat"
import useAuth from "../hooks/useAuth"
import MessageInput from "./MessageInput";
import io from "socket.io-client"
import ChatHeader from "./ChatHeader";

let socket;

const Chat = () => {
    const { selectedChat, setSelectedChat, getChatMessages, chatOnPage, setChatOnPage, isGettingChatMessages, chats, setChats, 
            updateChatsState, updateMessagesStatus, latestMessage, setLatestMessage } = useChat();
    const { auth, getProfilePhoto } = useAuth();
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if(Object.keys(selectedChat).length !== 0){
            getChatMessages(selectedChat._id)
        }
    }, [selectedChat])


    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    useEffect(() => {
        if(auth && auth._id !== undefined){
            socket.emit("Connected User", auth._id)
        }
    }, [auth])

    useEffect(() => {
        if(chatOnPage == null || latestMessage == null) return
        if(chatOnPage._id == latestMessage.chatId && latestMessage.sender != auth._id){
            const chat = chats.find(chat => chat._id == latestMessage.chatId)
            chat.messages[0] = latestMessage
            updateMessagesStatus(chat)
        }
    }, [chatOnPage, latestMessage])

    useEffect(() => {
        socket.on("Message sent", (message) => {
            if(chats.length != 0 
                && message.users.some((user) => user._id == auth._id) ){
                    setLatestMessage(message)
                    updateChatsState(message)
            }
        })

        socket.on("Message Chat Status Updated", (message) => {
            const chatChanged = chats.find(chat => chat._id == message.chatId)
            if(chatChanged){
                chatChanged.messages[0] = message
                const newChats = chats.map(chat => chat._id == message.chatId ? chatChanged : chat)
                setChats(newChats)
            }
        })
    })

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatOnPage]);

    const closeChat = () => {
        setSelectedChat({})
        setChatOnPage({})
    }
    if(isGettingChatMessages) 
        return  <span className="h-full flex justify-center items-center">
                    <p>Cargando mensajes</p>
                </span>

    if(Object.keys(chatOnPage).length === 0) 
        return  <span className="h-full flex justify-center items-center">
                    <p>Seleccione un chat para poder abrirlo</p>
                </span>

    return (
        <section className="h-full max-h-full flex flex-col justify-end">
            <section className="flex justify-between items-center w-full bg-gray-200">
                <ChatHeader user={selectedChat.users.find(user => user._id !== auth._id)} getProfilePhoto={getProfilePhoto}/>
                <article className="px-4 lg:hidden">
                    <button 
                        className="w-32 h-10 p-2 text-white bg-[#615EF0] hover:bg-[#504ec7] button rounded-md"
                        onClick={closeChat}
                    >Cerrar Chat</button>
                </article>
            </section>
            <section className="flex flex-col-reverse flex-grow overflow-scroll overflow-x-hidden " ref={chatContainerRef}>
                {

                    [...chatOnPage.messages].reverse().map((message, index) => {
                    const timestamp = new Date(message.createdAt)

                    if(auth._id == message.sender){
                        return <article className="text-right pr-4 mb-2" key={index}>
                                <article className="bg-[#615EF0] text-white inline-block rounded-s-xl rounded-tr-xl p-2 min-w-[100px] max-w-[50%]">
                                    <p className="text-left">{message.message}</p>
                                    <p className=" text-xs font-thin">{timestamp.getHours()}:{timestamp.getMinutes()}</p>
                                </article>
                            </article>
                    }

                    return <article key={index} className="pl-4 mb-2 max-w-[50%]">
                                <article className="bg-slate-300 inline-block rounded-e-xl rounded-tl-xl p-2 min-w-[100px]">
                                    <p className="mr-10">{message.message}</p>
                                    <p className="text-xs text-right">{timestamp.getHours()}:{timestamp.getMinutes()}</p>
                                </article>
                            </article>
                })}
            </section>
            <MessageInput/>
        </section>
    )
}

export default Chat