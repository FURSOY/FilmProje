import React, { useEffect, useState } from "react";
import { Card, Spin, Button, Rate, message } from "antd";
import Header from "../Layout/Header.jsx";
import useFilm from "../Hooks/useFilm.jsx";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext.jsx";
import useWatchList from "../Hooks/useWatchList";

const Profile = () => {
    const { userData, isAuthenticated } = useAuth();
    const { matchFilm, matchedFilm, voteMovie } = useFilm();
    const { filmId } = useParams();
    const [loading, setLoading] = useState(true);
    const [showOyver, setshowOyver] = useState(false);
    const { watchList, WatchListOperation } = useWatchList();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            await matchFilm(filmId);
            setLoading(false);
        };
        fetchProfile();
    }, [filmId]);

    const OyverMenu = () => {
        if (!userData) {
            message.error("Oy vermek için Giriş Yapmalısın");
        } else if (userData.votedMovies.includes(matchedFilm._id)) {
            console.log("bu filme oy zaten verilmiş");
        } else {
            setshowOyver(!showOyver);
        }
    };

    const Oyver = async (value) => {
        console.log(value);
        await voteMovie(value, filmId, userData._id);
        window.location.reload();
    };

    const onclickWatchFilm = async (action, filmId) => {
        await WatchListOperation(filmId, action)
        window.location.reload();
    }

    return (
        <>
            <Header />
            <main>
                {loading ? (
                    <Card className="loading-container">
                        <Spin />
                    </Card>
                ) : (
                    <div className="Card-Film">
                        <div className={`OyverMenu ${showOyver ? '' : 'hidden'}`}>
                            <h5>Oy vermek için Tıkla</h5>
                            <Rate
                                tooltips={['Zaman Kaybı', 'Berbat', 'Kötü', 'Çok Eksiği Var', 'Normal', 'Fena Değil', 'İzlenebilir', 'Çok güzel', 'Mükemmel', 'Efsane']}
                                onChange={Oyver}
                                count={10}
                                className="Rate"
                            />
                        </div>
                        <h1>{matchedFilm.originalTitle}</h1>
                        <img src={`http://img.omdbapi.com/?apikey=fa0806f5&i=${filmId}`} alt="" height={"250px"} />
                        <table className="FilmTable">
                            <tbody>
                                <tr className="FilmTr">
                                    <th className="FilmTh">Çıkış Tarihi</th>
                                    <th className="FilmTh">:</th>
                                    <th className="FilmTh">{matchedFilm.startYear}</th>
                                </tr>
                                <tr className="FilmTr">
                                    <th className="FilmTh">Türü</th>
                                    <th className="FilmTh">:</th>
                                    <th className="FilmTh">{matchedFilm.genres}</th>
                                </tr>
                                <tr className="FilmTr">
                                    <th className="FilmTh">Imdb Puanı</th>
                                    <th className="FilmTh">:</th>
                                    <th className="FilmTh">{matchedFilm.imdbRating}</th>
                                </tr>
                                <tr className="FilmTr">
                                    <th className="FilmTh">Imdb Oy Sayısı</th>
                                    <th className="FilmTh">:</th>
                                    <th className="FilmTh">{matchedFilm.numVotes}</th>
                                </tr>
                                <tr className="FilmTr">
                                    <th className="FilmTh">Site Puanı</th>
                                    <th className="FilmTh">:</th>
                                    <th className="FilmTh">{matchedFilm.siteTotalRating > 0 ? (matchedFilm.siteTotalRating / matchedFilm.siteNumVotes).toFixed(1) : '0'}</th>
                                </tr>
                                <tr className="FilmTr">
                                    <th className="FilmTh">Site Oy Sayısı</th>
                                    <th className="FilmTh">:</th>
                                    <th className="FilmTh">{matchedFilm.siteNumVotes ? matchedFilm.siteNumVotes : 0}</th>
                                </tr>
                            </tbody>
                        </table>
                        {isAuthenticated && userData.votedMovies.includes(matchedFilm._id) ? (
                            <Button danger className="voteBtn" type="primary">Bu Filme Zaten Oy verdin</Button>
                        ) : (
                            <Button className="voteBtn" onClick={OyverMenu} type="primary">Puan ver</Button>
                        )}

                        {!isAuthenticated ? (
                            <Link to="/login"><Button type="primary">Login</Button></Link>
                        ) : (
                            <div>
                                {userData.watchList.includes(matchedFilm._id) ? (
                                    <Button type="primary" className="FilmWatchBtn" onClick={() => onclickWatchFilm(false, matchedFilm.tconst)} danger>İzlenecekler listenden Kaldır</Button>
                                ) : (
                                    <Button type="primary" className="FilmWatchBtn" onClick={() => onclickWatchFilm(true, matchedFilm.tconst)}>İzlenecekler listene Ekle</Button>
                                )}
                            </div>
                        )}


                    </div>
                )}
            </main>
        </>
    );
};

export default Profile;
