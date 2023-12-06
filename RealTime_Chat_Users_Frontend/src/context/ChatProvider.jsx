import { useEffect, useState, createContext } from "react";
import axiosClient from "../config/axiosClient";
import io from "socket.io-client"
import useAuth from "../hooks/useAuth";

let socket;

const ChatContext = createContext();

// eslint-disable-next-line react/prop-types
const ChatProvider = ({children}) => {

    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState({});
    const [chatOnPage, setChatOnPage] = useState({});
    const [isGettingChatMessages, setIsGettingChatMessages] = useState(false);
    const [chatsWithNewMessages, setChatsWithNewMessages] = useState([]);
    const [latestMessage, setLatestMessage] = useState(null);
    const [ token, setToken ] = useState(localStorage.getItem("token") || "")

    const { auth } = useAuth();
    
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    useEffect(() => {
        const getChats = async () => {
            const token = localStorage.getItem("token")
            if(!token){
                setIsLoading(false)
                return
            }

            setToken(token)

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }

            try {
                const { data } = await axiosClient('chats', config)
                setChats(data);

            } catch (error) {
                console.log(error)
                setChats({});
            } finally {
                setIsLoading(false)
            }
        }
        getChats();
    }, [auth])

    const getChatMessages = async (chatId) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
        setIsGettingChatMessages(true)
        const { data } = await axiosClient.get(`/chats/${chatId}`, config)
        setChatOnPage(data)
        setIsGettingChatMessages(false)
    }

    const sendMessage =  async (message) => {

        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        await axiosClient.post(`/messages/send`, message, config)


        socket.emit("Send Message", message)
    }

    const updateChatsState = (message) => {
        message.createdAt = new Date()
        
        setChatOnPage(prevChatOnPage => {
            if (Object.keys(prevChatOnPage).length !== 0 && prevChatOnPage._id === message.chatId) {
                const oldMessages = prevChatOnPage.messages.filter((msg) => msg !== message);
                const messages = [...oldMessages, message];
                
                return {
                    _id: message.chatId,
                    users: message.users,
                    messages
                };
            }
            return prevChatOnPage;
        });
    
        setChatsWithNewMessages((prevChatsWithNewMessages) => {
            const chatWithNewMessages = prevChatsWithNewMessages.filter((chat) => chat !== message.chatId);

            if (message.sender == auth._id) {
                return [...chatWithNewMessages];
            } else {
                return [...chatWithNewMessages, message.chatId];
            }
          });
    
        setChats(prevChats => {
            const othersChat = prevChats.filter(chat => chat._id !== message.chatId);
            return [{ _id: message.chatId, users: message.users, messages: [message] }, ...othersChat];
        });
    }

    const findUser = async (email) => {

        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        return await axiosClient.get(`/users/find/${email}`, config)
    }  

    const findChatId = async (user1, user2) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        return await axiosClient.get(`/chats/get/${user1}/${user2}`, config)
    }

    
    const updateMessagesStatus = async (chat) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        const receiver = chat.users.find(user => user._id != chat.messages[0].sender)._id
        if(receiver != auth._id) return

        socket.emit("Update Messages Status", {...chat.messages[0], receiver, chatId: chat._id})
        return await axiosClient.post(`/messages/updateStatus`, {chatId: chat._id, userId: chat.messages[0].sender} , config)
    }

    const removeChatWithNewMessages = (chatId) => {
        const newChats = chatsWithNewMessages.filter(chat => chat !== chatId)
        setChatsWithNewMessages([...newChats])
    }

    const restartAll = () => {
        setChats([])
        setIsLoading(true)
        setSelectedChat({})
        setChatOnPage({})
        setIsGettingChatMessages(false)
        setChatsWithNewMessages([])
        setLatestMessage(null)
    }
    

    return (

        <ChatContext.Provider
            value={{
                setChats,
                chats,
                isLoading,
                selectedChat,
                setSelectedChat,
                getChatMessages,
                chatOnPage,
                isGettingChatMessages,
                sendMessage,
                updateChatsState,
                findUser,
                setChatOnPage,
                findChatId,
                chatsWithNewMessages,
                setChatsWithNewMessages,
                updateMessagesStatus,
                removeChatWithNewMessages,
                latestMessage,
                setLatestMessage,
                restartAll,
                setToken
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export {
    ChatProvider
}

export default ChatContext;
