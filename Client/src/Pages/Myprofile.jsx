import React from "react";
import { Button, Card, Flex, Avatar, Typography } from "antd";
import { EditOutlined } from '@ant-design/icons'
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
                <div className="Card-MYProfile">
                    <Typography.Title strong>Profil</Typography.Title>
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
                        E-Posta: {userData.email}
                    </Typography.Text>
                    <Typography.Text level={2} type="primary" strong>
                        Rol: {userData.role}
                    </Typography.Text>

                    <Flex>
                        <Link style={{ marginRight: "20px" }} to="edit">
                            <Button>Düzenle <EditOutlined /></Button>
                        </Link>
                        {
                            userData.verified === false ? <Link to="/verify"><Button style={{ marginRight: "20px" }} type="primary">Doğrula</Button></Link> : ''
                        }
                        <Button onClick={handleLogout} danger>
                            Çıkış Yap
                        </Button>
                    </Flex>

                </div>
            </main>
        </>
    );
};

export default Dashboard;
