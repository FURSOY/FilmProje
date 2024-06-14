import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../Contexts/AuthContext.jsx";

const useHomepage = () => {
    const { ServerIp } = useAuth();
    const [Messages, setMessages] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${ServerIp}/api/getmessages`);
                const messages = response.data;

                // Her bir mesaj için kullanıcı ve gerekirse film bilgilerini almak
                const messagesWithInfo = await Promise.all(
                    messages.map(async (message) => {
                        const userResponse = await axios.post(`${ServerIp}/api/getuser`, { userId: message.owner });
                        let updatedMessage = {
                            ...message,
                            userInfo: userResponse.data
                        };

                        if (message.type === "votemovie") {
                            const filmResponse = await axios.post(`${ServerIp}/api/getfilm`, { filmId: message.movie });
                            updatedMessage = {
                                ...updatedMessage,
                                filmInfo: filmResponse.data
                            };
                        }

                        return updatedMessage;
                    })
                );

                setMessages(messagesWithInfo);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        getMessages();
    }, [ServerIp]);

    return { Messages, loading };
};

export default useHomepage;
