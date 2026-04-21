import React, {
    useState,
    useEffect,
    Fragment,
    useCallback,
    useRef,
} from 'react';

import { Dialog } from 'antd-mobile';

import { PageLoading } from '@/component/PageLoading';
import CodeContent from '@/component/PhoneFrom';

import setTitle from '@/utility/settitle';
import instance from '@/request/index';
import { encrypt, randomStr, decrpt } from '@/utility/crypto';
import { appGate } from '@/utility/appGate';

const ResetPhone = (props) => {
    let { ticket } = props;
    const [phoneInfo, setPhoneInfo] = useState('');
    const [step, setStep] = useState(1);
    const [uncode, setUncode] = useState('');
    const [code, setCode] = useState('');
    const [phone, setPhone] = useState('');
    const [area, setArea] = useState(() => {
        return '86';
    });
    const timer1 = useRef(null);
    const timer2 = useRef(null);

    const getPhoneInfo = useCallback(() => {
        instance
            .post('/api/v1/user/getMobile', {
                token: ticket,
            })
            .then((d) => {
                // d.content.mobile = '86-18210103830';

                if (d.code === '200') {
                    let mobile = JSON.parse(decrpt(d.content, d.iv));

                    setPhoneInfo(mobile);
                }
            });
    }, [ticket]);

    const changFn = useCallback((value) => {
        setUncode(value);
    }, []);

    const onFinish = useCallback(() => {
        instance
            .post('/api/v1/user/checkSmsCode', {
                token: ticket,
                mobile: encrypt(phoneInfo.mobile),
                type: 4,
                code: uncode,
                iv: randomStr,
                from: 5,
            })
            .then((d) => {
                if (d.code === '200') {
                    if (timer1.current) {
                        clearTimeout(timer1.current);
                    }
                    setStep(2);
                }
            });
    }, [uncode, ticket, phoneInfo]);

    const getCodeFn = useCallback(() => {
        return instance.post('/api/v1/user/sendSms', {
            token: ticket,
            type: 4,
            mobile: encrypt(phoneInfo.mobile),
            iv: randomStr,
            from: 5,
        });
    }, [ticket, phoneInfo]);

    const getCodeLoginFn = useCallback(() => {
        if (!phone) {
            return;
        }
        return instance.post('/api/v1/user/sendSms', {
            token: ticket,
            type: 4,
            mobile: encrypt(phone),
            iv: randomStr,
            from: 5,
        });
    }, [phone, ticket]);

    const onFinishPhone = useCallback(() => {
        instance
            .post('/api/v1/user/resetMobile', {
                token: ticket,
                mobile: encrypt(phone),
                code: code,
                iv: randomStr,
                from: 5,
            })
            .then((d) => {
                if (d.code === '200') {
                    setStep(2);
                    setUncode(0);
                    Dialog.alert({
                        content: '换绑成功',
                        confirmText: '确定',
                        onConfirm: () => {
                            appGate.closeWeb();
                        },
                    });
                }
            });
    }, [code, phone, ticket]);

    useEffect(() => {
        setTitle('修改手机号');
        getPhoneInfo();
    }, [getPhoneInfo]);

    let mainContent = null;

    if (!phoneInfo) {
        mainContent = <PageLoading />;
    } else {
        mainContent = (
            <Fragment>
                {step === 1 ? (
                    <CodeContent
                        {...phoneInfo}
                        changFn={changFn}
                        onFinish={onFinish}
                        getCodeFn={getCodeFn}
                        uncode={uncode}
                        step={step}
                        setUncode={setUncode}
                        timer={timer1}
                    />
                ) : (
                    <CodeContent
                        changFn={changFn}
                        onFinish={onFinishPhone}
                        getCodeFn={getCodeLoginFn}
                        uncode={uncode}
                        step={step}
                        setPhone={setPhone}
                        phone={phone}
                        area={area}
                        setArea={setArea}
                        setUncode={setUncode}
                        code={code}
                        setCode={setCode}
                        timer={timer2}
                    />
                )}
            </Fragment>
        );
    }
    return <div className="reset-phone">{mainContent}</div>;
};

export default ResetPhone;
