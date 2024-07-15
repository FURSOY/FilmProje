import React, { useState, useRef } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { UserOutlined, HomeOutlined, MessageOutlined, ProductOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce'; // lodash.debounce kütüphanesini kullanarak debounce işlemi yapılır

const Header = () => {
    const { isAuthenticated, userData, ServerIp } = useAuth();
    const [matchedFilms, setmatchedFilms] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [linkClicked, setLinkClicked] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const navigate = useNavigate();

    const debouncedSearch = useRef(
        debounce(async (value) => {
            if (value.trim() === '') {
                setmatchedFilms([]);
                setShowDropdown(false);
                setSearchLoading(false);
                return;
            }

            try {
                setSearchLoading(true);
                const response = await axios.post(`${ServerIp}/api/searchfilm`, { SearchedValue: value }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                setmatchedFilms(response.data);
            } catch (error) {
                console.error('Arama hatası:', error);
            } finally {
                setSearchLoading(false);
            }
        }, 500) // 500 ms bekleme süresi
    ).current;

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchValue(value);
        setShowDropdown(true);
        setSearchLoading(true);
        debouncedSearch(value);
    };

    const handleBlur = () => {
        if (!linkClicked) setShowDropdown(false);
        setLinkClicked(false);
    };

    const handleFocus = () => {
        setShowDropdown(searchValue.trim() !== '');
    };

    const handleSearchPage = (value) => {
        if (value.trim() !== '') {
            navigate(`/search/${value}`);
        }
    };

    const handleSearchClick = () => {
        setSearchActive(!searchActive);
    };

    const contentStyle = {
        padding: 50,
        background: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 4,
    };

    const content = <div style={contentStyle} />;

    return (
        <header className={`${searchActive ? 'HeaderMobilSearch' : ''}`}>
            <Link className={`Logo ${searchActive ? 'hidden' : ''}`} to="/"><h1>FİLM PROJESİ</h1></Link>

            <Form className="PCSearchForm" onFinish={() => handleSearchPage(searchValue)}>
                <Input.Search
                    placeholder='Film Ara'
                    className="SearchInputPC"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onSearch={handleSearchPage}
                />
                <div className={`SearchDropDownPC ${showDropdown ? 'Active' : ''} ${searchLoading ? 'centerLoading' : ''} `} onMouseDown={() => setLinkClicked(true)}>
                    {searchLoading ? (
                        <Spin tip="Yükleniyor..." className='SearchLoading' size="large">
                            {content}
                        </Spin>
                    ) : matchedFilms.length === 0 ? (
                        <div className="searchedCard">Film bulunamadı</div>
                    ) : (
                        matchedFilms.map((film, index) => (
                            <Link to={`/film/${film.tconst}`} key={index}>
                                <div className="SearchedBox">
                                    <img
                                        src={`http://img.omdbapi.com/?apikey=fa0806f5&i=${film.tconst}`}
                                        height={"75px"}
                                        width={"50px"}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    {film.originalTitle}
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </Form>

            <ul className={`PCNavBar ${searchActive ? 'hidden' : ''}`}>
                <li>
                    <Link to="/" className="PCNav"><HomeOutlined /></Link>
                </li>
                {isAuthenticated && userData.role === "admin" && (
                    <li>
                        <Link to="/admin" className="PCNav"><ProductOutlined /></Link>
                    </li>
                )}
                <li>
                    {isAuthenticated ? (
                        <Link to="/myprofile"><Avatar src={userData.avatar} /></Link>
                    ) : (
                        <Link to="/login"><Button>Giriş Yap</Button></Link>
                    )}
                </li>
            </ul>

            <ul className="MobilNavBar">
                <li className={`MobilNav ${searchActive ? 'hidden' : ''}`}>
                    <button className="SearchBtnMobil" onClick={handleSearchClick}><SearchOutlined /></button>
                </li>
                <li className={`MobilNav ${searchActive ? 'hidden' : ''}`}>
                    {isAuthenticated ? (
                        <Link to="/myprofile"><Avatar src={userData.avatar} /></Link>
                    ) : (
                        <Link to="/login"><Button>Login</Button></Link>
                    )}
                </li>
            </ul>
            <button className={` ${!searchActive ? 'hidden' : ''}`} onClick={handleSearchClick}><ArrowLeftOutlined /></button>
            <Form className={`MobilSearchForm ${!searchActive ? 'hidden' : ''}`} onFinish={() => handleSearchPage(searchValue)}>
                <Input.Search
                    className="SearchInputMobil"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onSearch={handleSearchPage}
                />
                <div className={`SearchDropDownMobil ${showDropdown ? 'Active' : ''}`} onMouseDown={() => setLinkClicked(true)}>
                    {searchLoading ? (
                        <Spin className='Loading' />
                    ) : matchedFilms.length === 0 ? (
                        <div className="SearchedBox">Film bulunamadı</div>
                    ) : (
                        matchedFilms.map((film, index) => (
                            <Link className="SearchedBox" to={`/profile/${film.tconst}`} key={index}>
                                {film.originalTitle}
                            </Link>
                        ))
                    )}
                </div>
            </Form>
        </header>
    );
};

export default Header;
