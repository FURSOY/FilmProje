import React, { useEffect, useState } from "react";
import { Card, Avatar, Typography, Spin, Flex } from "antd";
import { UserOutlined } from '@ant-design/icons';
import Header from "../Layout/Header.jsx";
import useProfile from "../Hooks/useProfile.jsx";
import { useParams } from "react-router-dom";

const Profile = () => {
    const { matchProfile, matchedUser } = useProfile();
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            await matchProfile(userId);
            setLoading(false);
        };
        fetchProfile();
    }, [userId]);

    return (
        <>
            <Header />
            <main>
                {loading ? (
                    <div className="loading-container">
                        <Spin tip="Loading..." />
                    </div>
                ) : (
                    <Card className="CardPR">
                        <Flex vertical gap="small" align="center">
                            <Typography.Title strong>Profile</Typography.Title>
                            <div style={{ position: 'relative' }}>
                                <img alt="userImage" src={matchedUser.UserAvatar} width={"150px"} style={{ userSelect: "none", borderRadius: "50%" }} />
                                {
                                    matchedUser.UserVerified === true ? <img className="verifiedLogo" src="/tick.png" /> : ''
                                }
                            </div>
                            <Typography.Title level={2} strong>
                                {matchedUser.UserName}
                            </Typography.Title>
                            <Typography.Text level={2} type="primary" strong>
                                {matchedUser.UserRole}
                            </Typography.Text>
                        </Flex>
                    </Card>
                )}
            </main>
        </>
    );
};

export default Profile;
