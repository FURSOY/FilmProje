import { useState } from 'react';
import axios from 'axios';
import { message } from "antd";
import { useAuth } from "../Contexts/AuthContext.jsx";

const useFilm = () => {
    const [matchedFilm, setMatchedFilm] = useState(null);
    const { ServerIp } = useAuth();

    const matchFilm = async (filmId) => {
        try {
            const response = await axios.post(`${ServerIp}/api/film`, { filmId });
            setMatchedFilm(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const voteMovie = async (rate, filmId, userId) => {
        console.log(rate, filmId, userId);
        try {
            const response = await axios.post(`${ServerIp}/api/votefilm`, { rate, filmId, userId });

        } catch (error) {
            console.log(error);
        }
    }

    return { matchFilm, matchedFilm, voteMovie };
};

export default useFilm;
