import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const useUpdateProfileData = () => {
    const navigation = useNavigation();
    const { userData, updateProfileData, ServerIp } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const changeProfileData = async (values) => {
        setError(null);
        setLoading(true);
        const user = {
            id: userData._id,
            updatedEmail: values.email,
            updatedName: values.name,
            updatedRole: values.role,
            updatedAvatar: values.avatar
        };
        try {
            const response = await axios.post(
                `${ServerIp}/api/changeprofiledata`,
                user,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const newData = response.data;
            await updateProfileData(newData.user);
            setLoading(false);
            Toast.show({
                type: 'success',
                text1: "Profiliniz Güncellendi",
                text2: "Profiliniz Başarıyla Güncellendi"
            });
            navigation.navigate("myprofile");
        } catch (error) {
            setLoading(false);
            setError(error);
            Toast.show({
                type: 'error',
                text1: "Profilinizi Güncellerken Bir Hata Oluştu",
            });
            console.error("Error in changeProfileData:", error);
        }
    };

    return { loading, error, changeProfileData };
};

export default useUpdateProfileData;
