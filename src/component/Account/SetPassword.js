import React, {
    useState,
    useEffect,
    Fragment,
    useCallback,
    useRef,
} from 'react';

import { PageLoading } from '@/component/PageLoading';
import CodeContent from '@/component/PhoneFrom';
import { Form, Input, Button, Dialog } from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';

import setTitle from '@/utility/settitle';
import instance from '@/request/index';
import { encrypt, randomStr } from '@/utility/crypto';
import { appGate } from '@/utility/appGate';

const Password = ({ onFinish }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    return (
        <div className="phone-from">
            <Form
                form={form}
                layout="horizontal"
                onFinish={onFinish}
                className="ignore"
                footer={
                    <Fragment>
                        <Button
                            block
                            type="submit"
                            color="primary"
                            className="c-button"
                            style={{ display: 'none' }}
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        >
                            提交
                        </Button>
                        <Button
                            block
                            type="button"
                            color="primary"
                            className="phone-btn c-button"
                            onClick={() => {
                                form.submit();
                            }}
                        >
                            提交
                        </Button>
                    </Fragment>
                }
            >
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '密码不正确',
                        },
                    ]}
                    extra={
                        <div>
                            {!visible ? (
                                <EyeInvisibleOutline
                                    onClick={() => setVisible(true)}
                                />
                            ) : (
                                <EyeOutline onClick={() => setVisible(false)} />
                            )}
                        </div>
                    }
                >
                    <Input
                        placeholder="请输入密码"
                        clearable
                        type={visible ? 'text' : 'password'}
                    />
                </Form.Item>
            </Form>
        </div>
    );
};

const BindPhone = (props) => {
    let { ticket, type, api_url, api_url2 } = props;
    const [step] = useState(2);
    const [astep, setAstep] = useState(2);
    const [code, setCode] = useState('');
    const [phone, setPhone] = useState('');
    const [area, setArea] = useState(() => {
        return '86';
    });
    const timer1 = useRef(null);

    const getCodeLoginFn = useCallback(() => {
        if (!phone) {
            return;
        }
        return instance.post('/api/v1/user/sendSms', {
            token: ticket,
            type: type,
            mobile: encrypt(area + '-' + phone),
            iv: randomStr,
            from: 5,
        });
    }, [phone, area, ticket, type]);

    const onFinishPhone = useCallback(
        (values) => {
            instance
                .post(api_url, {
                    token: ticket,
                    mobile: encrypt(area + '-' + phone),
                    code: code,
                    iv: randomStr,
                    from: 5,
                })
                .then((d) => {
                    if (d.code === '200') {
                        setAstep(2);
                        setCode(0);
                    }
                });
        },
        [code, phone, area, ticket, api_url],
    );

    const onFinishSet = useCallback(
        (values) => {
            console.log(values);
            instance
                .post(api_url2, {
                    mobile: encrypt(area + '-' + phone),
                    newPwd: '',
                    nonce: '',
                    iv: randomStr,
                    from: 5,
                    code: encrypt(code),
                })
                .then((d) => {
                    if (d.code === '200') {
                        Dialog.alert({
                            content: '设置成功',
                            confirmText: '确定',
                            onConfirm: () => {
                                appGate.closeWeb();
                            },
                        });
                    }
                });
        },
        [area, phone, api_url2, code],
    );

    useEffect(() => {
        setTitle('忘记密码');
    }, []);

    let mainContent = null;

    if (!ticket) {
        mainContent = <PageLoading />;
    } else {
        mainContent = (
            <Fragment>
                {astep === 1 ? (
                    <CodeContent
                        onFinish={onFinishPhone}
                        getCodeFn={getCodeLoginFn}
                        step={step}
                        setPhone={setPhone}
                        phone={phone}
                        area={area}
                        setArea={setArea}
                        code={code}
                        setCode={setCode}
                        timer={timer1}
                    />
                ) : (
                    <Password onFinish={onFinishSet}></Password>
                )}
            </Fragment>
        );
    }
    return <div className="reset-phone">{mainContent}</div>;
};

export default BindPhone;
