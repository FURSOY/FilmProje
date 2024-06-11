import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../Contexts/AuthContext.jsx";

const useAdminData = () => {
    const [userByDay, setUserByDay] = useState({});
    const [userCountByRole, setUserCountByRole] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { ServerIp } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${ServerIp}/api/admin`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log(response.data)
                const data = response.data;

                // Tarih etiketlerini "Ay Gün" formatına dönüştürme
                const formattedUserByDay = {};
                for (const date in data.userCountByDay) {
                    const formattedDate = new Date(date).toLocaleString('tr-TR', { month: 'long', day: 'numeric' });
                    formattedUserByDay[formattedDate] = data.userCountByDay[date];
                }

                setUserByDay(formattedUserByDay);
                setUserCountByRole(data.userCountByRole);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [ServerIp]); // useEffect içinde kullanılan değişkeni bağımlılıklara ekle

    const deleteUser = async (userId) => {
        setLoading(true);
        try {
            const response = await axios.post(`${ServerIp}/api/auth/delete`, { userId });
            console.log(response.data);
            window.location.reload();
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    };

    return { userByDay, deleteUser, loading, error, userCountByRole };
};

export default useAdminData;
