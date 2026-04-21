import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Tabs } from 'antd-mobile';
import LayoutHead from '@/component/LayoutHead';
import {
    GetCodeContent,
    MobileField,
    StepPhoneCode,
} from '@/component/PhoneFrom';

import setTitle from '@/utility/settitle';
import instance, { instanceUser } from '@/request/index';
import { encrypt, randomStr, decrpt } from '@/utility/crypto';
// import SHA1 from 'ox-util/src/sha1.js';
import user from '@/utility/user';

const ApplyForm = ({ defaultValue, ticket }) => {
    const [form] = Form.useForm();
    const [phone, setPhone] = useState('');
    const [area, setArea] = useState(() => {
        return '86';
    });
    let navigate = useNavigate();
    useEffect(() => {
        // Toast.show(isBind);
    }, []);

    const onPhoneChange = useCallback((values) => {
        setPhone(values);
    }, []);

    const normCheckPhone = (e) => {
        return e.phone;
    };

    const preFn = useCallback(
        (values) => {
            return instance.post('/api/v1/user/getNonce', {
                account: encrypt(phone),
                iv: randomStr,
                from: 5,
            });
        },
        [phone],
    );

    const onFinish = useCallback(
        (values) => {
            preFn(values).then((s) => {
                if (s.flag === '001') {
                    let nonce = JSON.parse(decrpt(s.content, s.iv));
                    instanceUser
                        .post('/api/v1/login', {
                            account: encrypt(values.phone),
                            password: encrypt(values.password),
                            iv: randomStr,
                            from: 5,
                            nonce: encrypt(nonce.nonce),
                        })
                        .then((d) => {
                            if (d.code === '200') {
                                let { token } = JSON.parse(
                                    decrpt(d.content, d.iv),
                                );
                                user.refresh(token).then((data) => {
                                    console.log(data);
                                });
                            }
                        });
                }
            });
        },
        [preFn],
    );

    const onFinishFailed = useCallback((values) => {
        //alert(values);
        console.log(values);
    }, []);

    return (
        <div className="apply-form">
            <Form
                form={form}
                layout="horizontal"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={defaultValue}
                className="ignore"
                footer={
                    <Button
                        block
                        type="button"
                        color="primary"
                        className="c-button"
                        onClick={() => {
                            form.submit();
                        }}
                    >
                        登录
                    </Button>
                }
            >
                <Form.Item
                    name="phone"
                    getValueFromEvent={normCheckPhone}
                    rules={[
                        {
                            required: true,
                            message: '手机号码不正确',
                            pattern:
                                /^1([358][0-9]|4[579]|66|7[0135678]|9[1589])(\d+){8}$/,
                        },
                    ]}
                >
                    <MobileField
                        setPhone={onPhoneChange}
                        phone={phone}
                        area={area}
                        setArea={setArea}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码',
                        },
                    ]}
                >
                    <Input placeholder="请输入密码" clearable type="password" />
                </Form.Item>
            </Form>
            <div className="r__btn" style={{ display: 'none' }}>
                <Button
                    block
                    type="button"
                    color="primary"
                    onClick={() => {
                        navigate('/account/register');
                    }}
                >
                    注册
                </Button>
            </div>
        </div>
    );
};
const PhoneFormTab = ({ defaultValue }) => {
    let navigate = useNavigate();
    const [form] = Form.useForm();
    const [code, setCode] = useState('');
    const [phone, setPhone] = useState('');
    const [area, setArea] = useState(() => {
        return '86';
    });

    const timer1 = useRef(null);

    const getCodeFn = useCallback(() => {
        if (!phone) {
            return;
        }
        return instanceUser.post('/api/v1/sendSms', {
            mobile: encrypt(phone),
            iv: randomStr,
            from: 5,
        });
    }, [phone]);

    useEffect(() => {
        // Toast.show(isBind);
    }, []);

    const onFinish = useCallback(
        (values) => {
            instanceUser
                .post('/api/v1/smsLogin', {
                    mobile: encrypt(phone),
                    iv: randomStr,
                    from: 5,
                    code: code,
                })
                .then((d) => {
                    console.log(decrpt(d.content, d.iv));
                    if (d.code === '200') {
                        let { token } = JSON.parse(decrpt(d.content, d.iv));

                        user.refresh(token);
                    }
                });
        },
        [code, phone],
    );

    const onFinishFailed = useCallback((values) => {
        //alert(values);
        console.log(values);
    }, []);

    const onPhoneChange = useCallback((values) => {
        setPhone(values);
    }, []);

    const normCheckPhone = (e) => {
        return e.phone;
    };

    const normCheckCode = (e) => {
        return e.code;
    };

    return (
        <div className="apply-form">
            <Form
                form={form}
                layout="horizontal"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={defaultValue}
                className="ignore"
                footer={
                    <Button
                        block
                        type="button"
                        color="primary"
                        className="c-button"
                        onClick={() => {
                            form.submit();
                        }}
                    >
                        登录
                    </Button>
                }
            >
                <Form.Item
                    name="phone"
                    getValueFromEvent={normCheckPhone}
                    rules={[
                        {
                            required: true,
                            message: '手机号码不正确',
                            pattern:
                                /^1([358][0-9]|4[579]|66|7[0135678]|9[1589])(\d+){8}$/,
                        },
                    ]}
                >
                    <MobileField
                        setPhone={onPhoneChange}
                        phone={phone}
                        area={area}
                        setArea={setArea}
                    />
                </Form.Item>
                <Form.Item
                    rules={[{ required: true, message: '验证码不能为空' }]}
                    name={'code'}
                    getValueFromEvent={normCheckCode}
                    extra={
                        <GetCodeContent
                            mobile={phone}
                            getCodeFn={getCodeFn}
                            step={2}
                            timer={timer1}
                            setArea={setArea}
                        />
                    }
                    className="code-input"
                >
                    <StepPhoneCode code={code} setCode={setCode} />
                </Form.Item>
            </Form>
            <div className="r__btn" style={{ display: 'none' }}>
                <Button
                    block
                    type="button"
                    color="primary"
                    onClick={() => {
                        navigate('/account/register');
                    }}
                >
                    注册
                </Button>
            </div>
        </div>
    );
};

const LoginPage = (props) => {
    let { phone, ticket } = props;
    let [tabKey, setTabKey] = useState('1');
    let [defaultValue] = useState(() => {
        return {
            phone,
        };
    });

    const setTabFn = useCallback((key) => {
        setTabKey(key);
    }, []);

    useEffect(() => {
        console.log(tabKey);
        setTitle('登录');
    }, [ticket, tabKey]);

    return (
        <div className="apply-page">
            <LayoutHead title={'登录'} num={1} />
            <div className="tem-tab">
                <Tabs
                    activeLineMode="fixed"
                    onChange={setTabFn}
                    style={{
                        '--fixed-active-line-width': '0px',
                        '--content-padding': '0px',
                    }}
                >
                    <Tabs.Tab title="手机登录" key="1">
                        <PhoneFormTab
                            {...props}
                            defaultValue={defaultValue}
                            ticket={ticket}
                        />
                    </Tabs.Tab>
                    <Tabs.Tab title="账号登录" key="2">
                        <ApplyForm
                            {...props}
                            defaultValue={defaultValue}
                            ticket={ticket}
                        />
                    </Tabs.Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default LoginPage;
