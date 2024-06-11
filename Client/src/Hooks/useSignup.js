import { useState } from "react";
import { message } from "antd";
import { useAuth } from "../Contexts/AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
    const { login, ServerIp } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const navigate = useNavigate()

    const registerUser = async (values) => {
        if (values.password !== values.passwordConfirm) {
            return setError("Şifreler Uyuşmuyor");
        }

        try {
            setError(null);
            setLoading(true);
            const response = await axios.post(
                `${ServerIp}/api/signup`,
                values,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (response.status === 201) {
                message.success(data.message);
                login(data.token, data.user);
                navigate("/verify")
            } else if (response.status === 400) {
                console.log("dsafdsa");
                setError(data.message);
            } else {
                message.error("Kayıt Başarısız");
            }
        } catch (error) {
            message.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerUser };
};

export default useSignup;
