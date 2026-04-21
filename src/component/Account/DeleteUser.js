import React, { useEffect, Fragment, useCallback, useRef } from 'react';
import { Button, Dialog } from 'antd-mobile';

import setTitle from '@/utility/settitle';
import instance from '@/request/index';

import { appGate } from '@/utility/appGate';

const FormUser = function ({ info, ticket }) {
    const textareaRef = useRef(null);

    const onCancle = useCallback(() => {
        instance
            .post('/api/v1/user/doCancel', {
                token: ticket,
            })
            .then((d) => {
                if (d.code === '200') {
                    Dialog.alert({
                        content: d.content,
                        confirmText: '确定',
                        onConfirm: () => {
                            // window.location.reload();
                            appGate.toLogin();
                        },
                    });
                }
            });
    }, [ticket]);

    //var formRef = useRef(null);

    return (
        <div className="the-form">
            <textarea
                placeholder="请填写注销原因，最多输入200字。"
                ref={textareaRef}
            ></textarea>
            <div className="phone-form">
                <div className="confirm">
                    <p className="tip">{confirm[0]}</p>
                    <div className="btns">
                        <Button
                            color="primary"
                            fill="outline"
                            type="button"
                            onClick={appGate.closeWeb}
                        >
                            取消
                        </Button>
                        <Button
                            onClick={onCancle}
                            color="primary"
                            type="button"
                            className="c-button"
                        >
                            确定
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DelePhone = ({ ticket, InfoText }) => {
    const onComplete = useCallback(() => {}, []);

    useEffect(() => {
        setTitle('注销账号');
    }, []);

    let mainContent = null;

    mainContent = (
        <Fragment>
            <InfoText></InfoText>
            <FormUser onComplete={onComplete} ticket={ticket} />
        </Fragment>
    );
    return <div className="viewport-account-delete ">{mainContent}</div>;
};

export default DelePhone;
