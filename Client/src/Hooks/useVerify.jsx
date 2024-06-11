import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../Contexts/AuthContext.jsx";
import { message } from "antd";

const useVerify = () => {
    const [error, setError] = useState(null);
    const { ServerIp, userData, updateProfileData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState(120);

    useEffect(() => {
        // Time countdown function
        if (time > 0) {
            const timer = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [time]);

    const createCode = async () => {
        setLoading(true);
        try {
            await axios.post(`${ServerIp}/api/createverify`, { userId: userData._id });
            setTime(120); // Reset the timer to 120 seconds
        } catch (error) {
            setError(error);
            message.error("Kod oluşturulurken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async (values) => {
        setLoading(true);
        try {
            const code = parseInt(values.code);

            const response = await axios.post(`${ServerIp}/api/verificationcode`, { userId: userData._id, code: code });

            if (response.status === 200) {
                await updateProfileData(response.data.user);
                message.success("Hesabınız doğrulandı");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                message.error("Geçersiz kod");
            } else {
                message.error("Bir hata oluştu");
            }
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return { createCode, verifyCode, error, loading, time };
};

export default useVerify;
