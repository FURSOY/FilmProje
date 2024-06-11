import { useState } from "react";
import { message } from "antd";
import { useAuth } from "../Contexts/AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useChangeProfileData = () => {
    const navigate = useNavigate();
    const { userData, updateProfileData, ServerIp } = useAuth();  // Burada doğru adı kullanıyoruz
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const changeProfileData = async (values) => {
        setError(null);
        setLoading(true);
        const user = {
            id: userData._id,
            updatedEmail: values.updatedEmail,
            updatedName: values.updatedName,
            updatedRole: values.updatedRole,
            updatedAvatar: values.updatedAvatar // Updated avatar included here
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
            await updateProfileData(newData.user);  // Burada doğru adı kullanıyoruz
            setLoading(false);
            message.success("Profile data changed successfully");
            navigate("/myprofile");
        } catch (error) {
            setLoading(false);
            setError(error);
            message.error("Error changing profile data");
            console.error("Error in changeProfileData:", error);
        }
    };

    return { loading, error, changeProfileData };
};

export default useChangeProfileData;
