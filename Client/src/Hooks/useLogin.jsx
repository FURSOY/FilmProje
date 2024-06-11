import { useState } from "react";
import { message } from "antd";
import { useAuth } from "../Contexts/AuthContext.jsx";
import axios from 'axios';

const useLogin = () => {
    const { login, ServerIp } = useAuth();
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    const loginUser = async (values) => {

        try {
            setError(null)
            setLoading(true)
            const response = await axios.post(`${ServerIp}/api/login`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            if (response.status === 200) {
                message.success(data.message)
                login(data.token, data.user)
            } else if (response.status === 404) {
                setError(data.message);
            } else {
                message.error('Giriş Başarısız')
            }
        } catch (error) {
            message.error(error.response.data.message);
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, loginUser };
}

export default useLogin;
