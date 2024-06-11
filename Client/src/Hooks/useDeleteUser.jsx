import { useState } from 'react';
import axios from 'axios';

const useDeleteUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { ServerIp } = useAuth();

    const deleteUser = async (userId) => {
        setLoading(true);
        try {
            const response = await axios.post(`${ServerIp}/api/delete`, { userId });
            console.log(response.data);
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    };

    return { deleteUser, loading, error };
};

export default useDeleteUser;