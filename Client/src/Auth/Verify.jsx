import React, { useState } from 'react';
import Header from '../Layout/Header';
import { Card, Form, Input, Typography, Button, Spin, Alert } from 'antd';
import useVerify from '../Hooks/useVerify';

const Verify = () => {
    const [verifyFormShow, setVerifyFormShow] = useState(false);
    const { createCode, verifyCode, error, loading, time } = useVerify();

    const onVerifyClick = async () => {
        await createCode();
        setVerifyFormShow(true);
    };

    const handleVerify = async (values) => {
        await verifyCode(values);
    };

    return (
        <>
            <Header />
            <main>
                <Card className='Form-Container'>
                    {
                        loading ? <Spin /> :
                            <div style={{ display: 'flex', gap: 'large', alignItems: 'center' }}>
                                {/* Form */}
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <Typography.Title level={3} strong className='title'>
                                        Hesabını Doğrula
                                    </Typography.Title>
                                    <Button className={`${verifyFormShow && time > 0 ? 'hidden' : ''}`} onClick={onVerifyClick}>E-postana kod Gönder</Button>
                                    <Form onFinish={handleVerify} className={`${verifyFormShow && time > 0 ? '' : 'hidden'}`} layout='vertical' autoComplete='off'>
                                        <p style={{ textAlign: 'center', marginBottom: '20px' }}>{`Kodu Girmen için son ${time} saniye`}</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Form.Item name="code" rules={[{ required: true, message: 'Lütfen kodu girin' }]}>
                                                <Input.OTP />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button htmlType='submit'>Doğrula</Button>
                                            </Form.Item>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                    }
                </Card>
            </main>
        </>
    );
};

export default Verify;
