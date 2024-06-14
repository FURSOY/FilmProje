import React, { useState } from "react";
import { Button, Flex, Typography, Form, Input, Select } from "antd";
import { useAuth } from "../Contexts/AuthContext.jsx";
import Header from "../Layout/Header.jsx";
import useChangeProfileData from "../Hooks/useChangeProfileData.jsx";
import AvatarEditor from 'react-avatar-edit';

const Dashboard = () => {
    const { userData } = useAuth();
    const { changeProfileData } = useChangeProfileData();
    const [preview, setPreview] = useState(userData.avatar);
    const [src, setSrc] = useState(null);
    const [avatarEditorShow, setAvatarEditorShow] = useState(false);

    const handleSave = async (values) => {
        try {
            if (!preview) {
                throw new Error('Please upload and crop an avatar');
            }
            await changeProfileData({ ...values, updatedAvatar: preview });
            console.log({ ...values, updatedAvatar: preview });
        } catch (error) {
            console.error('Error updating profile:', error.message);
        }
    };

    const toggleAvatarEditorShow = () => {
        setAvatarEditorShow(!avatarEditorShow);
    };

    const onClose = () => {
        setPreview(userData.avatar);
    };

    const onCrop = (view) => {
        setPreview(view);
    };

    const onBeforeFileLoad = (elem) => {
        const file = elem.target.files[0];
        if (file.size > 2097152) { // 2MB
            alert("File is too big!");
            elem.target.value = "";
            return;
        }
    };

    return (
        <>
            <Header />
            <main>
                <div className="Card-MYProfile">
                    <Flex vertical gap="small" align="center">
                        <h1 >Your Profile</h1>
                        <Form
                            autoComplete="off"
                            initialValues={{
                                updatedName: userData.name,
                                updatedEmail: userData.email,
                                updatedRole: userData.role,
                            }}
                            onFinish={handleSave}
                        >
                            <div>
                                <Flex vertical align="center">
                                    <div className={`AvatarEditorBox ${avatarEditorShow ? '' : 'hidden'}`}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                toggleAvatarEditorShow();
                                                setPreview(userData.avatar);
                                            }}
                                            className="closeBtn"
                                        >
                                            X
                                        </button>
                                        <AvatarEditor
                                            width={300}
                                            height={300}
                                            onCrop={onCrop}
                                            onClose={onClose}
                                            onBeforeFileLoad={onBeforeFileLoad}
                                            src={src}
                                        />
                                        <button type="button" onClick={toggleAvatarEditorShow} className="okayBtn">Okay</button>
                                    </div>
                                    <button className="avatarBtn" type="button" onClick={toggleAvatarEditorShow}>
                                        <img alt="userImage" src={preview} width="150px" height="150px" style={{ userSelect: "none", borderRadius: "50%" }} />
                                    </button>
                                </Flex>
                            </div>
                            <Form.Item className="EditProfileInput" label="Name" name="updatedName">
                                <Input />
                            </Form.Item>
                            <Form.Item className="EditProfileInput" label="Email" name="updatedEmail">
                                <Input />
                            </Form.Item>
                            <Form.Item className="EditProfileInput" label="Role" name="updatedRole">
                                <Select
                                    options={[
                                        { value: "user", label: "User" },
                                        { value: "developer", label: "Developer" },
                                        { value: "admin", label: "Admin" },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item className="EditProfileInput">
                                <Button className="EditProfileSubmitBtn" type="primary" htmlType="submit">
                                    Kaydet
                                </Button>
                            </Form.Item>
                        </Form>
                    </Flex>
                </div>
            </main>
        </>
    );
};

export default Dashboard;