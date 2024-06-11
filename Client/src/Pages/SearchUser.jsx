import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Layout/Header.jsx';
import axios from 'axios';
import { Card, Avatar, Typography, Space, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../Contexts/AuthContext';
import { Content } from 'antd/es/layout/layout.js';

const Search = () => {
    const { ServerIp } = useAuth();
    const { searchedName } = useParams();
    const [searchResults, setSearchResults] = useState([]);
    const [Loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true)
            const response = await axios.post(`${ServerIp}/api/search`, { SearchedValue: searchedName }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setLoading(false)
            setSearchResults(response.data.matchedUsers);
        };

        fetchSearchResults();
    }, [searchedName]);

    return (
        <>
            <Header />
            <main className='SearchMain'>
                <div className='SearchBox'>
                    <Typography.Text style={{ display: `${Loading ? 'none' : 'block'}` }}>Arama Sonuçları: "{searchedName}"</Typography.Text>
                    {Loading ? <Spin /> : searchResults.length === 0 ? (
                        <div className='404BoxSearch'>Kullanıcı bulunamadı</div>
                    ) : (
                        searchResults.map((user, index) => (
                            <Link className='searchedBox' to={`/profile/${user._id}`} key={index}>
                                <div style={{ position: 'relative' }}>
                                    <img src={user.avatar} alt="UA" width={"50px"} />
                                    {
                                        user.verified === true ? <img className="verifiedLogo" src="/tick.png" /> : ''
                                    }
                                </div>
                                <Typography.Text>{user.name}</Typography.Text>
                            </Link>
                        ))
                    )}
                    <Typography.Text style={{ display: `${Loading ? 'none' : 'block'}` }} ></Typography.Text>

                </div>


            </main >
        </>
    );
};

export default Search;
