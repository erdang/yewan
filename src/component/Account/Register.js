import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Checkbox, Input, Dialog } from 'antd-mobile';
import LayoutHead from '@/component/LayoutHead';
import {
    GetCodeContent,
    MobileField,
    StepPhoneCode,
} from '@/component/PhoneFrom';

import setTitle from '@/utility/settitle';
import { instanceUser } from '@/request/index';
import { encrypt, randomStr, decrpt } from '@/utility/crypto';
// import SHA1 from 'ox-util/src/sha1.js';

// import VConsole from 'vconsole';

// // eslint-disable-next-line no-unused-vars
// const vConsole = new VConsole();

const CheckboxContent = ({ value = {}, onChange, ruleText, type }) => {
    let navigate = useNavigate();
    const changeBox = useCallback(
        (e) => {
            const triggerChange = (changedValue) => {
                onChange?.({
                    hasRule: e,
                    ...value,
                    ...changedValue,
                });
            };
            triggerChange({
                hasRule: e === true ? e : undefined,
            });
        },
        [onChange, value],
    );

    const toRule = useCallback(() => {
        navigate(`/agree/${type}`);
    }, [navigate, type]);
    return (
        <Checkbox
            onChange={changeBox}
            style={{
                '--icon-size': '18px',
                '--font-size': '14px',
                '--gap': '6px',
            }}
            className="rule-text"
        >
            我已阅读并同意,<span onClick={toRule}>{ruleText}</span>
        </Checkbox>
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
        return instanceUser.post('/sms', {
            mobile: encrypt(area + '-' + phone),
            iv: randomStr,
            from: 5,
        });
    }, [phone, area]);

    useEffect(() => {
        // Toast.show(isBind);
    }, []);

    const preFn = useCallback((values) => {
        return instanceUser.post('/preregister', {
            username: encrypt(values.username),
            iv: randomStr,
            from: 5,
        });
    }, []);

    const onFinish = useCallback(
        (values) => {
            preFn(values).then((s) => {
                if (s.code === '001') {
                    let nonce = JSON.parse(decrpt(s.body, s.iv));
                    console.log(values.password + nonce.nonce);
                    instanceUser
                        .post('/register', {
                            username: encrypt(values.username),
                            password: encrypt(values.password),
                            password2: encrypt(values.password2),
                            mobile: encrypt(area + '-' + values.phone),
                            code: encrypt(values.code),
                            iv: randomStr,
                            from: 5,
                        })
                        .then((d) => {
                            if (d.code === '001') {
                                Dialog.alert({
                                    content: '注册成功去登录吧',
                                    confirmText: '确定',
                                    onConfirm: () => {
                                        navigate('/logonPage');
                                    },
                                });
                            }
                        });
                }
            });
        },
        [preFn, area, navigate],
    );

    const onFinishFailed = useCallback((values) => {
        //alert(values);
        console.log(values);
    }, []);

    const onPhoneChange = useCallback((values) => {
        setPhone(values);
    }, []);

    const normCheckBox = (e) => {
        return e.hasRule;
    };
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
                        注册
                    </Button>
                }
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名',
                        },
                    ]}
                >
                    <Input placeholder="请输入用户名" />
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
                    <Input
                        placeholder="请输入密码"
                        autocomplete={false}
                        clearable
                        type="password"
                    />
                </Form.Item>
                <Form.Item
                    name="password2"
                    rules={[
                        {
                            required: true,
                            message: '请输入确认密码',
                        },
                    ]}
                >
                    <Input
                        placeholder="请输入确认密码"
                        autocomplete={false}
                        clearable
                        type="password"
                    />
                </Form.Item>
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

                <Form.Item
                    getValueFromEvent={normCheckBox}
                    name="请勾选《用户协议》"
                    rules={[
                        {
                            required: true,
                            message: '请勾选《用户协议》',
                        },
                    ]}
                >
                    <CheckboxContent
                        ruleText={'《用户协议》'}
                        type="userRule"
                    />
                </Form.Item>
                <Form.Item
                    getValueFromEvent={normCheckBox}
                    name="请勾选《用户隐私政策》"
                    rules={[
                        {
                            required: true,
                            message: '请勾选《用户隐私政策》',
                        },
                    ]}
                >
                    <CheckboxContent
                        ruleText={'《用户隐私政策》'}
                        type="privacyPolicy"
                    />
                </Form.Item>
            </Form>
        </div>
    );
};

const LoginPage = (props) => {
    let { phone, ticket } = props;

    let [defaultValue] = useState(() => {
        return {
            phone,
        };
    });

    useEffect(() => {
        setTitle('注册');
    }, [ticket]);

    return (
        <div className="apply-page">
            <LayoutHead title={'注册'} />
            <PhoneFormTab
                {...props}
                defaultValue={defaultValue}
                ticket={ticket}
            />
        </div>
    );
};

export default LoginPage;
