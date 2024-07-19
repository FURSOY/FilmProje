import { useState } from "react";
import { showMessage } from "react-native-flash-message";
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
            showMessage({
                message: "Profile data changed successfully",
                type: "success",
                duration: 3000,
            });
            navigation.navigate("myprofile");
        } catch (error) {
            setLoading(false);
            setError(error);
            showMessage({
                message: "Error changing profile data",
                type: "danger",
                duration: 3000,
            });
            console.error("Error in changeProfileData:", error);
        }
    };

    return { loading, error, changeProfileData };
};

export default useUpdateProfileData;
