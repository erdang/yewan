import React, {
    useState,
    useEffect,
    Fragment,
    useCallback,
    useRef,
} from 'react';
import { Form, Input, Button, Dialog, Picker, Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';

const GetCodeContent = ({ mobile, getCodeFn, timer }) => {
    const [showDtime, setShowDtime] = useState(false);
    const [dtime, setDtime] = useState(60);
    const count = useRef(60);

    const cutDownFn = useCallback(() => {
        timer.current = setTimeout(() => {
            if (count.current <= 0) {
                clearTimeout(timer.current);
                setShowDtime(false);
                count.current = 60;
                setDtime(60);
                return;
            }
            if (count.current > 0) {
                count.current--;
                cutDownFn();
            }
            setDtime(count.current);
        }, 1000);
    }, [timer]);

    const sendCodeFn = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        if (!mobile) {
            Dialog.alert({
                content: '手机号不能为空',
                confirmText: '确定',
                onConfirm: () => {
                    console.log('Confirmed');
                },
            });
            return;
        }
        getCodeFn().then((d) => {
            if (d.code === '200') {
                Dialog.alert({
                    content: '发送成功',
                    confirmText: '确定',
                    onConfirm: () => {},
                });
                cutDownFn();
                setShowDtime(true);
            }
        });
    }, [cutDownFn, getCodeFn, mobile, timer]);

    useEffect(() => {});

    return (
        <div>
            {showDtime ? (
                <Button disabled color="primary" fill="outline">
                    重新发送({dtime}s)
                </Button>
            ) : (
                <Button
                    color="primary"
                    fill="outline"
                    type="button"
                    onClick={sendCodeFn}
                >
                    发送验证码
                </Button>
            )}
        </div>
    );
};

const columns = [['86']];
const MobileField = ({ value, onChange, setPhone, phone, area, setArea }) => {
    const [visible, setVisible] = useState(false);
    //const [phone, setPhone] = useState('');

    const triggerChange = useCallback(
        (changedValue) => {
            onChange?.({
                phone: phone,
                ...value,
                ...changedValue,
            });
        },
        [phone, value, onChange],
    );
    const onRealValueChange = useCallback(
        (value) => {
            setPhone(value);
            triggerChange({ phone: value });
        },
        [triggerChange, setPhone],
    );

    return (
        <Fragment>
            <Space align="center">
                <Space align="center" onClick={() => setVisible(true)}>
                    <div>+{area}</div>
                    <DownOutline />
                </Space>
                <Input
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={onRealValueChange}
                />
            </Space>
            <Picker
                columns={columns}
                visible={visible}
                onClose={() => {
                    setVisible(false);
                }}
                onConfirm={(v) => {
                    setArea(v);
                }}
            />
        </Fragment>
    );
};

const StepPhoneCode = ({ value, onChange, code, setCode }) => {
    const triggerChange = useCallback(
        (changedValue) => {
            onChange?.({
                code: code,
                ...value,
                ...changedValue,
            });
        },
        [code, value, onChange],
    );
    const onRealValueChange = useCallback(
        (value) => {
            setCode(value);
            triggerChange({ code: value });
        },
        [triggerChange, setCode],
    );
    return <Input placeholder="请输入验证码" onChange={onRealValueChange} />;
};

const CodeContent = ({
    mobile,
    onFinish,
    getCodeFn,
    changFn,
    uncode,
    step,
    setPhone,
    phone,
    area,
    setArea,
    code,
    setCode,
    timer,
}) => {
    const [form] = Form.useForm();

    const [avalue] = useState(() => {
        return mobile;
    });

    const normCheckPhone = (e) => {
        return e.phone;
    };
    const normCheckCode = (e) => {
        return e.code;
    };

    return (
        <div className={'phone-from ' + (step === 1 ? 'setp1' : '')}>
            <Form
                form={form}
                layout="horizontal"
                initialValues={
                    step === 1 ? { phone: avalue, code: uncode } : ''
                }
                onFinish={onFinish}
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
                    label={step === 1 ? '' : ''}
                    getValueFromEvent={step === 2 ? normCheckPhone : ''}
                    name={step === 2 ? 'mobile' : 'phone'}
                    rules={
                        step === 2
                            ? [
                                  {
                                      required: true,
                                      message: '手机号不能为空',
                                      pattern:
                                          /^1([358][0-9]|4[579]|66|7[0135678]|9[1589])(\d+){8}$/,
                                  },
                              ]
                            : []
                    }
                >
                    {step === 1 ? (
                        <Input disabled />
                    ) : (
                        <MobileField
                            setPhone={setPhone}
                            phone={phone}
                            area={area}
                            setArea={setArea}
                        />
                    )}
                </Form.Item>

                <Form.Item
                    rules={[{ required: true, message: '验证码不能为空' }]}
                    name={step === 2 ? 'code' : 'uncode'}
                    getValueFromEvent={step === 2 ? normCheckCode : ''}
                    extra={
                        step === 1 ? (
                            <GetCodeContent
                                mobile={avalue}
                                getCodeFn={getCodeFn}
                                step={step}
                                timer={timer}
                            />
                        ) : (
                            <GetCodeContent
                                mobile={phone}
                                getCodeFn={getCodeFn}
                                step={step}
                                timer={timer}
                            />
                        )
                    }
                    className="code-input"
                >
                    {step === 1 ? (
                        <Input placeholder="请输入验证码" onChange={changFn} />
                    ) : (
                        <StepPhoneCode code={code} setCode={setCode} />
                    )}
                </Form.Item>
            </Form>
        </div>
    );
};
export { MobileField, GetCodeContent, StepPhoneCode };
export default CodeContent;
