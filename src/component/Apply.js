import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { Form, Input, Button, Dialog } from 'antd-mobile';
import { PageLoading } from '@/component/PageLoading';
import BasicUpload from '@/component/BasicUpload';

import instance from '@/request/index';
import setTitle from '@/utility/settitle';
import urltool from 'ox-util/src/url.js';

import { appGate } from '@/utility/appGate';
const searchParam = urltool.param(window.location.search);

// import VConsole from 'vconsole';

// // eslint-disable-next-line no-unused-vars
// const vConsole = new VConsole();

// const ID_TYPE = {
//     0: '身份证',
//     1: '护照',
//     2: '台胞证',
// };

const UserInfo = ({ appUser, changeUser }) => {
    return (
        <div className={'apply-user-info border-bottom'}>
            <section className="label">认证用户</section>
            <section className="main">
                <span>{appUser.nickname}</span>
                <span>({appUser.rid})</span>
                {/* <span onClick={changeUser}>更换</span> */}
            </section>
        </div>
    );
};

const ApplyForm = ({
    ChangeFromStatePhoneFn,
    ChangeFromStateNameFn,
    ChangeFromStateGradeFn,
    ChangeFromStateIdCardFn,
    defaultValue,
    ticket,
    isBind,
    setIsBind,
}) => {
    const [form] = Form.useForm();
    const [first, setFirst] = useState(true);

    useEffect(() => {
        // Toast.show(isBind);
    }, []);

    const onFinish = useCallback(
        (values) => {
            if (values.picUrl[0].url === '') {
                Dialog.alert({
                    content: '请重新上传身份证',
                    confirmText: '确定',
                    onConfirm: () => {},
                });
                return false;
            }
            instance
                .post('/api/v1/audit/add', {
                    token: ticket,
                    mobile: values.phone,
                    name: values.realname,
                    idcard: values.idCard,
                    idcard_hand: values.picUrl[0].url2,
                    uid: searchParam.uid,
                })
                .then((d) => {
                    if (d.code === '200') {
                        Dialog.alert({
                            content: d.content,
                            bodyClassName: 'dialog-suer',
                            confirmText: '确定',
                            onConfirm: () => {
                                appGate.closeWeb();
                            },
                        });
                    }
                });
        },
        [ticket],
    );

    const onFinishFailed = useCallback((values) => {
        //alert(values);
        console.log(values);
    }, []);

    const onPhoneChange = useCallback(
        (values) => {
            ChangeFromStatePhoneFn(values);
        },
        [ChangeFromStatePhoneFn],
    );

    const onNameChange = useCallback(
        (values) => {
            ChangeFromStateNameFn(values);
        },
        [ChangeFromStateNameFn],
    );
    const onIdChange = useCallback(
        (values) => {
            ChangeFromStateIdCardFn(values);
        },
        [ChangeFromStateIdCardFn],
    );

    const normFile = (e) => {
        setFirst(false);
        if (Array.isArray(e)) {
            return e;
        }

        return e && e.fileList;
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
                style={{
                    '--border-inner': '1px solid #EAEAEA ',
                    '--border-bottom': '1px solid #EAEAEA ',
                    '--border-top': '1px solid #EAEAEA ',
                }}
                footer={
                    <Button
                        block
                        type="button"
                        className="c-button"
                        color="primary"
                        onClick={() => {
                            form.submit();
                        }}
                    >
                        提交
                    </Button>
                }
            >
                <Form.Item
                    name="phone"
                    label="手机号码"
                    rules={[
                        {
                            required: true,
                            message: '手机号码不正确',
                            pattern:
                                /^1([358][0-9]|4[579]|66|7[01235678]|9[13589])(\d+){8}$/,
                        },
                    ]}
                >
                    <Input
                        onChange={onPhoneChange}
                        placeholder="请输入手机号码"
                    />
                </Form.Item>
                <Form.Item
                    name="realname"
                    label="真实姓名"
                    rules={[{ required: true, message: '姓名不正确' }]}
                >
                    <Input
                        onChange={onNameChange}
                        placeholder="请输入真实姓名"
                    />
                </Form.Item>
                <Form.Item
                    name="idCard"
                    label="身份证号"
                    rules={[
                        {
                            required: true,
                            message: '身份证号不正确',
                            pattern:
                                /^(\d{6})(18|19|20)(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X|x)$/,
                        },
                    ]}
                >
                    <Input onChange={onIdChange} placeholder="请输入身份证号" />
                </Form.Item>

                <div className="adm-list-item adm-form-item up-label">
                    <div className="adm-list-item-content-prefix">
                        <label
                            className="adm-form-item-label"
                            htmlFor="手持证件照"
                        >
                            手持证件照
                            <span className="adm-form-item-required-asterisk">
                                *
                            </span>
                        </label>
                    </div>
                </div>
                <Form.Item
                    name="picUrl"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: '手持证件照不能为空' }]}
                >
                    <BasicUpload
                        first={first}
                        setFirst={setFirst}
                        isBind={isBind}
                        setIsBind={setIsBind}
                        face="up"
                        enc={1}
                        ticket={ticket}
                    />
                </Form.Item>
                <p className="o-form-tip">
                    <strong>注：</strong>
                    请上传本人手持证件照片，要求面部清晰无遮挡，同时证件照照片及号码清晰可辨认。
                </p>
            </Form>
        </div>
    );
};

const ApplyPage = (props) => {
    let { phone, realname, gradeID, idCard, ticket, userInfo } = props;
    let [defaultValue] = useState(() => {
        return {
            phone,
            realname,
            gradeID,
            idCard,
        };
    });
    const [isBind, setIsBind] = useState(false);
    const changeUser = useCallback(() => {}, []);

    useEffect(() => {
        setTitle('实名认证');

        if (appGate.inApp() && !appGate.inAppIOS()) {
            console.log('apply');
            appGate.IsHavePermission(['photos', 'camera']).then((err) => {
                console.log('apply----' + err);
                setIsBind(!Number(err));
            });
        }
    }, [ticket]);

    let mainContent = null;

    if (!ticket) {
        mainContent = <PageLoading />;
    } else {
        mainContent = (
            <Fragment>
                <UserInfo
                    appUser={userInfo}
                    changeUser={changeUser}
                    ticket={ticket}
                />
                <ApplyForm
                    {...props}
                    defaultValue={defaultValue}
                    ticket={ticket}
                    isBind={isBind}
                    setIsBind={setIsBind}
                />
            </Fragment>
        );
    }
    return <div className="apply-page">{mainContent}</div>;
};

export default ApplyPage;
