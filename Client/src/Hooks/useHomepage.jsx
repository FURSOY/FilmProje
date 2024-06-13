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
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        getMessages();
    }, [ServerIp]); // ServerIp bağımlılığı eklendi

    useEffect(() => {
        if (Messages !== null) {
            console.log(Messages);
        }
    }, [Messages]);

    return { Messages, loading };
};

export default useHomepage;
