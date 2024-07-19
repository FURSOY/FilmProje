import React from 'react';
import Header from '../Layout/Header.jsx';
import { Typography, Spin, Button } from "antd";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import useHomepage from '../Hooks/useHomepage';
import useWatchList from "../Hooks/useWatchList";
import { Link } from 'react-router-dom';

const Homepage = () => {
    const { Messages, loading } = useHomepage();
    const { watchList, WatchListOperation, WatchedListOperation, watchedList } = useWatchList();

    // Function to format createdAt date
    const formatCreatedAt = (createdAt) => {
        const date = new Date(createdAt);
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
    };

    const contentStyle = {
        padding: 50,
        background: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 4,
    };

    const content = <div style={contentStyle} />;

    return (
        <>
            <Header />
            <main className='AnaSayfaMain'>
                <div className='OneCıkanlarBox'>
                    <h1 className='OneCikanlarTitle'>Öne Çıkanlar</h1>
                    <div className={`MessageCont ${loading ? 'centerLoading' : ''}`}>
                        {loading ? (
                            <Spin tip="Yükleniyor..." className='SearchLoading' size="large">
                                {content}
                            </Spin>
                        ) : (
                            (Messages === null || Messages.length === 0) ? (
                                <Typography.Paragraph>No messages found.</Typography.Paragraph>
                            ) : (
                                Messages.map((message, index) => (
                                    <div key={index} className='MessageBox'>
                                        <Link className='imgLink' to={`/profile/${message.owner}`}>
                                            <img style={{ paddingRight: "5px", borderRadius: "50%" }} src={message.userInfo.avatar} alt="User Avatar" width={"35px"} height={"35px"} />
                                            {
                                                message.userInfo.verified === true ? <img className="verifiedLogoHomepage" src="/tick.png" /> : ''
                                            }
                                        </Link>
                                        {message.type === "signup" ? (
                                            <p><strong>{message.userInfo.name}</strong> hesap oluşturdu</p>
                                        ) : message.type === "votemovie" ? (
                                            <p><strong>{message.userInfo.name}</strong> {message.filmInfo.originalTitle} filmine <strong>{message.rate}</strong> puan verdi</p>
                                        ) : (
                                            'lala'
                                        )}
                                        <h6 style={{ position: "absolute", top: "5px", right: "10px" }}>
                                            {formatCreatedAt(message.createdAt)}
                                        </h6>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>
                <div className='FriendsRequetsBox'>
                    <h1 className='OneCikanlarTitle'>İzlediklerim Listesi</h1>
                    <div className='MessageCont'>
                        {watchedList.map((film, index) => (
                            <div key={index} className='WatchListBoxHomepage'>
                                <h6 style={{ float: "right", marginRight: "5px" }} ></h6>
                                <Link style={{ color: "black" }} to={`/film/${film.tconst}`}>
                                    {film.originalTitle}
                                </Link>
                                <p style={{ position: "absolute", right: "5px", top: "5px", fontSize: "14px" }}>
                                    Imdb: {film.imdbRating}
                                </p>
                                <p style={{ position: "absolute", right: "5px", bottom: "5px", fontSize: "14px" }}>
                                    Site: {!film.siteTotalRating ? 'N' : film.siteTotalRating / film.siteNumVotes}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='WatchListBox'>
                    <h1 className='OneCikanlarTitle'>İzlenecekler Listesi</h1>
                    <div className='MessageCont'>
                        {watchList.map((film, index) => (
                            <div key={index} className='WatchListBoxHomepage'>
                                <h6 style={{ float: "right", marginRight: "5px" }} ></h6>
                                <Link style={{ color: "black" }} to={`/film/${film.tconst}`}>
                                    {film.originalTitle}
                                </Link>
                                <p style={{ position: "absolute", right: "95px", top: "5px", fontSize: "14px" }}>
                                    Imdb: {film.imdbRating}
                                </p>
                                <p style={{ position: "absolute", right: "95px", bottom: "5px", fontSize: "14px" }}>
                                    Site: {!film.siteTotalRating ? 'N' : film.siteTotalRating / film.siteNumVotes}
                                </p>
                                <Button
                                    style={{ width: "40px", height: "40px", background: "green" }}
                                    onClick={async () => {
                                        await WatchedListOperation(film.tconst, true);
                                        window.location.reload(); // Refreshes the page after removing from watchlist
                                    }}
                                    className="WatchListAddButton"
                                    type='primary'
                                >
                                    <CheckOutlined style={{ fontSize: "25px" }} />
                                </Button>
                                <Button
                                    style={{ width: "40px", height: "40px" }}
                                    onClick={async () => {
                                        await WatchListOperation(film.tconst, false);
                                    }}
                                    className="WatchListDeleteButton"
                                    type='primary'
                                    danger
                                >
                                    <CloseOutlined style={{ fontSize: "25px" }} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}

export default Homepage;
