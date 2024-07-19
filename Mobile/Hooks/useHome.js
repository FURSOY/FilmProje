import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../Contexts/AuthContext";

const useHome = () => {
    const { ServerIp } = useAuth();
    const [loading, setLoading] = useState(false);
    const [Messages, setMessages] = useState(null);

    const getMessages = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${ServerIp}/api/getmessages`);
            const messages = response.data;

            const messagesWithInfo = await Promise.all(
                messages.map(async (message) => {
                    try {
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
                    } catch (error) {
                        console.error('Error fetching additional message info:', error);
                        return message; // Hata durumunda orijinal mesajı döndür
                    }
                })
            );

            setMessages(messagesWithInfo);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMessages();
    }, [ServerIp]); // ServerIp değişkenini bağımlılık olarak ekleyin

    const refreshMessages = () => {
        getMessages();
    };

    return { Messages, loading, refreshMessages };
};

export default useHome;
