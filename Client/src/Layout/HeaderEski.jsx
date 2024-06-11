import React, { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { UserOutlined, HomeOutlined, MessageOutlined, ProductOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Header = () => {
    const { isAuthenticated, userData, ServerIp } = useAuth();
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [linkClicked, setLinkClicked] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const navigate = useNavigate();

    const handleSearchChange = async (e) => {
        setShowDropdown(true);
        setSearchLoading(true);

        const { value } = e.target;
        setSearchValue(value);
        if (value.trim() === '') {
            setMatchedUsers([]);
            setShowDropdown(false);
            return;
        }
        try {
            const response = await axios.post(`${ServerIp}/api/search`, { SearchedValue: value }, {
                headers: { 'Content-Type': 'application/json' }
            });
            setMatchedUsers(response.data.matchedUsers);
        } catch (error) {
            console.error('Search error:', error);
            setMatchedUsers([]);
        } finally {
            setSearchLoading(false);
        }
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

    return (
        <header className={`${searchActive ? 'HeaderMobilSearch' : ''}`}>
            <Link className={`Logo ${searchActive ? 'hidden' : ''}`} to="/"><h1>FURSOY</h1></Link>

            <Form className="PCSearchForm" onFinish={() => handleSearchPage(searchValue)}>
                <Input.Search
                    className="SearchInputPC"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onSearch={handleSearchPage}
                />
                <div className={`SearchDropDownPC ${showDropdown ? 'Active' : ''}`} onMouseDown={() => setLinkClicked(true)}>
                    {searchLoading ? (
                        <Spin className='Loading' size='large' />
                    ) : matchedUsers.length === 0 ? (
                        <div className="searchedCard">Kullanıcı bulunamadı</div>
                    ) : (
                        matchedUsers.map((user, index) => (
                            <Link className="SearchedBox" to={`/profile/${user._id}`} key={index}>
                                <div style={{ position: 'relative', marginRight: '20px' }}>
                                    <img width={"40px"} src={user.avatar} />
                                    {
                                        user.verified === true ? <img className="verifiedLogoSearchHeader" src="/tick.png" /> : ''
                                    }
                                </div>
                                {user.name}
                            </Link>
                        ))
                    )}
                </div>
            </Form>

            <ul className={`PCNavBar ${searchActive ? 'hidden' : ''}`}>
                <li>
                    <Link to="/" className="PCNav"><HomeOutlined /></Link>
                </li>
                <li>
                    <Link to="/" className="PCNav"><MessageOutlined /></Link>
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
                        <Link to="/login"><Button>Login</Button></Link>
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
                    ) : matchedUsers.length === 0 ? (
                        <div className="SearchedBox">Kullanıcı bulunamadı</div>
                    ) : (
                        matchedUsers.map((user, index) => (
                            <Link className="SearchedBox" to={`/profile/${user._id}`} key={index}>
                                <div style={{ position: 'relative' }}>
                                    <img width={"30px"} src={user.avatar} />
                                    {
                                        user.verified === true ? <img className="verifiedLogo" src="/tick.png" /> : ''
                                    }
                                </div>

                                {user.name}
                            </Link>
                        ))
                    )}
                </div>
            </Form>
        </header>
    );
};
