import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
const ChatContext = createContext();

const ChatProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])

    useEffect(() => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (!userInfo) {
                navigate('/');
            } else {
                setUser(userInfo);
            }
        } catch (error) {
            console.error("Error parsing JSON data:", error);
            // Handle the error or log it as needed
        }
    }, [navigate]);

    return <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
        {children}
    </ChatContext.Provider>
}

export const ChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider;