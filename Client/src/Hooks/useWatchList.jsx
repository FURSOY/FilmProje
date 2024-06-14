import { useState, useEffect, act } from 'react';
import axios from 'axios';
import { useAuth } from "../Contexts/AuthContext.jsx";
import { message } from 'antd';

const useWatchList = () => {
    const [watchList, setWatchList] = useState([]);
    const [watchedList, setWatchedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { ServerIp, userData, authLoading } = useAuth();

    useEffect(() => {
        const fetchWatchList = async (userId) => {
            try {
                const response = await axios.post(`${ServerIp}/api/getwatchlist`, { userId });
                setWatchList(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Watchlist alınırken bir hata oluştu:', error);
                setLoading(false);
            }
        };
        const fetchWatchedList = async (userId) => {
            try {
                const response = await axios.post(`${ServerIp}/api/getwatchedlist`, { userId });
                setWatchedList(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Watchedlist alınırken bir hata oluştu:', error);
                setLoading(false);
            }
        };

        if (!authLoading && userData && userData._id) {
            fetchWatchList(userData._id);
            fetchWatchedList(userData._id)
        }
    }, [authLoading, userData, ServerIp]);

    const WatchListOperation = async (filmId, action) => {
        console.log(action);
        const response = await axios.post(`${ServerIp}/api/addwatchlist`, { userId: userData._id, filmId, action });

        message.success(response.data.message)
    }

    const WatchedListOperation = async (filmId, action) => {
        console.log(action);
        const response = await axios.post(`${ServerIp}/api/addwatchedlist`, { userId: userData._id, filmId, action });

        message.success(response.data.message)
    }

    return { watchedList, watchList, loading, WatchListOperation, WatchedListOperation };
};

export default useWatchList;
