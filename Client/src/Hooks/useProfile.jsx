import { useState } from 'react';
import axios from 'axios';
import { message } from "antd";
import { useAuth } from "../Contexts/AuthContext.jsx";

const useProfile = () => {
    const [matchedUser, setMatchedUser] = useState(null);
    const { ServerIp } = useAuth();

    const matchProfile = async (userId) => {
        try {
            const response = await axios.post(`${ServerIp}/api/profile`, { userId });
            setMatchedUser(response.data);
            message.success("Kullanıcı bulundu");
        } catch (error) {
            console.log(error);
        }
    };

    return { matchProfile, matchedUser };
};

export default useProfile;
