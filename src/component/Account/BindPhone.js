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
import { encrypt, randomStr } from '@/utility/crypto';
import { appGate } from '@/utility/appGate';

const BindPhone = (props) => {
    let { ticket } = props;
    const [step] = useState(2);
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
            type: 4,
            mobile: encrypt(phone),
            iv: randomStr,
            from: 5,
        });
    }, [phone, ticket]);

    const onFinishPhone = useCallback(
        (values) => {
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
                        Dialog.alert({
                            content: '绑定成功',
                            confirmText: '确定',
                            onConfirm: () => {
                                appGate.closeWeb();
                            },
                        });
                        setCode(0);
                    }
                });
        },
        [code, phone, ticket],
    );

    useEffect(() => {
        setTitle('绑定手机号');
    }, []);

    let mainContent = null;

    if (!ticket) {
        mainContent = <PageLoading />;
    } else {
        mainContent = (
            <Fragment>
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
            </Fragment>
        );
    }
    return <div className="reset-phone">{mainContent}</div>;
};

export default BindPhone;
