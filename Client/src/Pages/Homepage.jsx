import React from 'react';
import Header from '../Layout/Header.jsx';
import { Typography, Spin, Button } from "antd";
import useHomepage from '../Hooks/useHomepage';
import useWatchList from "../Hooks/useWatchList";
import { Link } from 'react-router-dom';

const Homepage = () => {
    const { Messages, loading } = useHomepage();
    const { watchList, WatchListOperation } = useWatchList();

    // Tarih formatını güzelleştirmek için yardımcı fonksiyon
    const formatCreatedAt = (createdAt) => {
        const date = new Date(createdAt);
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
    };

    return (
        <>
            <Header />
            <main className='AnaSayfaMain'>
                <div className='OneCıkanlarBox'>
                    <h1 className='OneCikanlarTitle'>Öne Çıkanlar</h1>
                    <div className='MessageCont'>
                        {
                            loading ? (
                                <Spin />
                            ) : (
                                Messages === null || Messages.length === 0 ? (
                                    <Typography.Paragraph>No messages found.</Typography.Paragraph>
                                ) : (
                                    Messages.map((message, index) => (
                                        <div key={index} className='MessageBox'>
                                            <h6 style={{ float: "right", marginRight: "5px", marginLeft: "5px" }} >{formatCreatedAt(message.createdAt)}</h6>
                                            <Typography.Paragraph>{message.content}</Typography.Paragraph>
                                        </div>
                                    ))
                                )
                            )
                        }
                    </div>
                </div>
                <div className='FriendsRequetsBox'>
                    <h1 className='OneCikanlarTitle'>İzlediklerim Listesi</h1>
                </div>
                <div className='WatchListBox'>
                    <h1 className='OneCikanlarTitle'>İzlenecekler Listesi</h1>
                    <div className='MessageCont'>
                        {
                            watchList.map((film, index) => (
                                <div className='WatchListBoxHomepage'>
                                    <h6 style={{ float: "right", marginRight: "5px" }} ></h6>
                                    <Link style={{ color: "black" }} to={`/film/${film.tconst}`} >{film.originalTitle}</Link>
                                    <p className='SrcImdbRatingText' style={{ fontSize: "12px" }} >Imdb: {film.imdbRating}</p>
                                    <Button style={{ width: "30px", height: "30px" }} onClick={() => removeWatchFilm(false, film.tconst)} className="WatchListDeleteButton" danger>X</Button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </main>
        </>
    );
}

export default Homepage;
