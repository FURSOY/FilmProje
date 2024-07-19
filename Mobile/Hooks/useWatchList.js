import { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useAuth } from '../Contexts/AuthContext';

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
            fetchWatchedList(userData._id);
        }
    }, [authLoading, userData, ServerIp]);

    const WatchListOperation = async (filmId, action) => {
        try {
            const response = await axios.post(`${ServerIp}/api/addwatchlist`, { userId: userData._id, filmId, action });
            Toast.show({
                type: 'success',
                text1: response.data.message,
            });
        } catch (error) {
            console.error('WatchList operation error:', error);
            Toast.show({
                type: 'error',
                text1: 'Operation failed',
            });
        }
    };

    const WatchedListOperation = async (filmId, action) => {
        try {
            const response = await axios.post(`${ServerIp}/api/addwatchedlist`, { userId: userData._id, filmId, action });
            Toast.show({
                type: 'success',
                text1: response.data.message,
            });
        } catch (error) {
            console.error('WatchedList operation error:', error);
            Toast.show({
                type: 'error',
                text1: 'Operation failed',
            });
        }
    };

    return { watchedList, watchList, loading, WatchListOperation, WatchedListOperation };
};

export default useWatchList;
