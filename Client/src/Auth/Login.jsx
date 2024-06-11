import React from 'react'
import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import useLogin from "../Hooks/useLogin";
import Header from '../Layout/Header';


const Login = () => {
    const { error, loading, loginUser } = useLogin();

    const handleLogin = async (values) => {
        await loginUser(values)
    }

    return (
        <>
            <Header />
            <main>
                <Card className='CardPR-Login'>
                    <Flex gap="large" align='center'>
                        <Flex vertical flex={1}>
                            <Typography.Title level={3} strong className='title'>Giriş Yap</Typography.Title>
                            <Typography.Text type='secondary' strong className='slogan'>Mutlu olucaksın</Typography.Text>
                            <Form layout='vertical' onFinish={handleLogin} autoComplete='off'>
                                <Form.Item label="Email" name="email" rules={[{
                                    required: true,
                                    message: 'lütfen emailinizi yazın'
                                },
                                {
                                    type: "email",
                                    message: "lütfen doğru bir email yazın"
                                }
                                ]}>
                                    <Input placeholder='Email' />
                                </Form.Item>
                                <Form.Item label="Password" name="password" rules={[{
                                    required: true,
                                    message: 'Lütfen Şifrenizi Girin'
                                }]}>
                                    <Input.Password placeholder='Password' />
                                </Form.Item>
                                {error && (<Alert description={error} type='error' showIcon closable className='alert' />)}


                                <Form.Item>
                                    <Button type='primary' htmlType='submit' size='large' className='btn'>
                                        {loading ? <Spin /> : 'Giriş Yap'}
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Link to="/register">
                                        <Button size='large' className='btn'>Hesabın yok mu? Hesap Oluştur</Button>
                                    </Link>

                                </Form.Item>
                            </Form>
                        </Flex>
                    </Flex>
                </Card >
            </main>

        </>

    )

}

export default Login