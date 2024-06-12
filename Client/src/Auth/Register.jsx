import React, { useState } from 'react';
import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import useSignup from '../Hooks/useSignup';
import Header from '../Layout/Header';
import convertToBase64 from '../Helper/Convert';

const Register = () => {
    const { loading, error, registerUser } = useSignup();

    const handleRegister = async (values) => {
        try {
            registerUser({ ...values });
        } catch (error) {
            console.error('Error registering user:', error.message);
        }
    };

    return (
        <>
            <Header />
            <main>
                <div className='Card-Register'>
                    <Flex gap='large' align='center'>
                        {/* Form */}
                        <Flex vertical flex={1}>
                            <Typography.Title level={3} strong className='title'>
                                Create An Account
                            </Typography.Title>
                            <Typography.Text type='secondary' strong className='slogan'>
                                Join For Exclusive Access!
                            </Typography.Text>
                            <Form layout='vertical' onFinish={handleRegister} autoComplete='off'>
                                <Form.Item
                                    label='User Name'
                                    name='name'
                                    rules={[{ required: true, message: 'Please enter your user name.' }]}>
                                    <Input placeholder='User Name' />
                                </Form.Item>
                                <Form.Item
                                    label='Email'
                                    name='email'
                                    rules={[
                                        { required: true, message: 'Please enter your email address.' },
                                        { type: 'email', message: 'Please enter a valid email address.' },
                                    ]}>
                                    <Input placeholder='Email' />
                                </Form.Item>
                                <Form.Item
                                    label='Password'
                                    name='password'
                                    rules={[{ required: true, message: 'Please enter your password.' }]}>
                                    <Input.Password placeholder='Password' />
                                </Form.Item>
                                <Form.Item
                                    label='Password Confirm'
                                    name='passwordConfirm'
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: 'Please confirm your password.' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error('The two passwords that you entered do not match.')
                                                );
                                            },
                                        }),
                                    ]}>
                                    <Input.Password placeholder='Confirm Password' />
                                </Form.Item>
                                {error && <Alert description={error} type='error' showIcon closable className='alert' />}

                                <Form.Item>
                                    <Button type='primary' htmlType='submit' size='large' className='btn'>
                                        {loading ? <Spin /> : 'Create Account'}
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Link to='/login'>
                                        <Button size='large' className='btn'>
                                            Sign In
                                        </Button>
                                    </Link>
                                </Form.Item>
                            </Form>
                        </Flex>
                    </Flex>
                </div>
            </main>
        </>
    );
};

export default Register;
