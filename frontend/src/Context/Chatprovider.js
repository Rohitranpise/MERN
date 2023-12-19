import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // Set initial user state to null
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
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
        };

        fetchUserData();
    }, [navigate]);

    // Render children only when user data is available
    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
            {children}
        </ChatContext.Provider>
    )
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
