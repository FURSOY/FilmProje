import React from "react";
import { Button, Card, Flex, Avatar, Typography } from "antd";
import { UserOutlined } from '@ant-design/icons'
import { useAuth } from "../Contexts/AuthContext.jsx";
import Header from "../Layout/Header.jsx";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { userData, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            <Header />
            <main>
                <div className="CardPR">
                    <Typography.Title strong>Your Profile</Typography.Title>
                    <div style={{ position: 'relative', zIndex: "2" }}>
                        <img alt="userImage" src={userData.avatar} width={"150px"} style={{ userSelect: "none", borderRadius: "50%", zIndex: "2" }} />
                        {
                            userData.verified === true ? <img className="verifiedLogo" src="/tick.png" /> : ''
                        }
                    </div>
                    <Typography.Title level={2} strong>
                        {userData.name}
                    </Typography.Title>
                    <Typography.Text level={2} type="primary" strong>
                        Email: {userData.email}
                    </Typography.Text>
                    <Typography.Text level={2} type="primary" strong>
                        Role: {userData.role}
                    </Typography.Text>
                    {
                        userData.verified === false ? <Link to="/verify"><Button type="primary">Verify</Button></Link> : ''
                    }
                    <Link to="edit">
                        <Button>Edit</Button>
                    </Link>
                    <Button onClick={handleLogout} danger>
                        Logout
                    </Button>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
