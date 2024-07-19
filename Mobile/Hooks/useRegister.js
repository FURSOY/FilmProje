import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';

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
                Toast.show({
                    type: 'error',
                    text1: data.message,
                    text2: 'Hesap Başarıyla Oluşturuldu'
                });
                login(data.token, data.user);
                navigation.navigate("home");
            } else if (response.status === 400) {
                setError(data.message);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Hesap OLuşturulamadı',
                    text2: 'Hesap Oluşturulurken Bir Hatayla Karşılaşıldı'
                });
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Hesap OLuşturulamadı',
                text2: 'Hesap Oluşturulurken Bir Hatayla Karşılaşıldı'
            });
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerUser };
};

export default useRegister;
