import { useState, useEffect, act } from 'react';
import axios from 'axios';
import { useAuth } from "../Contexts/AuthContext.jsx";
import { message } from 'antd';

const useWatchList = () => {
    const [watchList, setWatchList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { ServerIp, userData, authLoading, updateProfileData } = useAuth();

    useEffect(() => {
        const fetchWatchList = async (userId) => {
            try {
                const response = await axios.post(`${ServerIp}/api/getfilm`, { userId });
                setWatchList(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Watchlist alınırken bir hata oluştu:', error);
                setLoading(false);
            }
        };

        if (!authLoading && userData && userData._id) {
            fetchWatchList(userData._id);
        }
    }, [authLoading, userData, ServerIp]);

    const WatchListOperation = async (filmId, action) => {
        console.log(action);
        const response = await axios.post(`${ServerIp}/api/addwatchlist`, { userId: userData._id, filmId, action });
        console.log(response.data);

        message.success(response.data.message)
    }

    return { watchList, loading, WatchListOperation };
};

export default useWatchList;
