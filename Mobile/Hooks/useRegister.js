import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import { useAuth } from "../Contexts/AuthContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const useRegister = () => {
    const { login, ServerIp } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const navigation = useNavigation();

    const registerUser = async (values) => {
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
                showMessage({
                    message: data.message,
                    type: "success",
                });
                login(data.token, data.user);
                navigation.navigate("home");
            } else if (response.status === 400) {
                setError(data.message);
            } else {
                showMessage({
                    message: "Kayıt Başarısız",
                    type: "danger",
                });
            }
        } catch (error) {
            console.log(error);
            showMessage({
                message: error.response.data.message,
                type: "danger",
            });
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerUser };
};

export default useRegister;
