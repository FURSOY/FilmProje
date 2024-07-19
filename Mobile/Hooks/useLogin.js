import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

const useLogin = () => {
    const { login, ServerIp } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const loginUser = async (values) => {
        try {
            setError(null);
            setLoading(true);

            const response = await fetch(`${ServerIp}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.status === 200) {
                showMessage({
                    message: data.message,
                    type: "success",
                });
                await login(data.token, data.user);
                navigation.navigate("home"); // Navigasyonunuzun doğru olduğundan emin olun
            } else if (response.status === 404) {
                setError(data.message);
            } else {
                showMessage({
                    message: "Giriş Yaparken Bir Sorun Oluştu.",
                    type: "error",
                });
            }
        } catch (error) {
            Alert.alert('Hata', error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, loginUser };
};

export default useLogin;
