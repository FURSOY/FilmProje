import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Layout/Header.jsx';
import axios from 'axios';
import { Card, Avatar, Typography, Space, Spin } from 'antd';
import { useAuth } from '../Contexts/AuthContext';

const Search = () => {
    const { ServerIp } = useAuth();
    const { searchedFilm } = useParams();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await axios.post(`${ServerIp}/api/searchfilm`, { SearchedValue: searchedFilm }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setSearchResults(response.data);
            } catch (error) {
                console.error('Arama hatası:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchedFilm, ServerIp]);

    return (
        <>
            <Header />
            <main className='SearchMain'>
                <div className='SearchBox'>
                    <Typography.Text style={{ display: `${loading ? 'none' : 'block'}` }}>Arama Sonuçları: "{searchedFilm}"</Typography.Text>
                    {loading ? (
                        <Spin />
                    ) : searchResults && searchResults.length === 0 ? (
                        <div className='404BoxSearch'>Film bulunamadı</div>
                    ) : (
                        searchResults.map((film, index) => (
                            <Link to={`/film/${film.tconst}`} key={index}>
                                <div className='searchedBox' style={{ position: 'relative' }}>
                                    <img
                                        src={`http://img.omdbapi.com/?apikey=fa0806f5&i=${film.tconst}`}
                                        height={"75px"}
                                        width={"50px"}
                                        style={{ marginRight: "20px" }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <Typography.Text>{film.originalTitle}</Typography.Text>
                                    <Typography.Text className='SrcImdbRatingText' >Imdb: {film.imdbRating}</Typography.Text>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </>
    );
};

export default Search;
