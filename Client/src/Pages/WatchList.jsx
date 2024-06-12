import React from "react";
import { Spin, Typography, Button } from "antd";
import Header from "../Layout/Header.jsx";
import useWatchList from "../Hooks/useWatchList";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { watchList, loading, WatchListOperation } = useWatchList();

    const removeWatchFilm = async (action, filmId) => {
        console.log("fa");
        await WatchListOperation(filmId, action)
        window.location.reload()
    }

    return (
        <>
            <Header />
            <main>
                <div className="Card-WatchList">
                    <Typography.Title strong>WatchList</Typography.Title>
                    {loading ? (
                        <Spin />
                    ) : watchList.length === 0 ? (
                        <p>Watchlist boş.</p>
                    ) : (
                        watchList.map((film, index) => {
                            return (
                                <div key={index} className="watchListBox">
                                    <img src={`http://img.omdbapi.com/?apikey=fa0806f5&i=${film.tconst}`} width={"70px"} height={"95px"} />
                                    <Link className="WatchListLink" to={`/film/${film.tconst}`}>{film.originalTitle}</Link>
                                    <p className='SrcImdbRatingText'>Imdb: {film.imdbRating}</p>
                                    <Button onClick={() => removeWatchFilm(false, film.tconst)} className="WatchListDeleteButton" danger>X</Button>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </>
    );
};

export default Dashboard;
