import './index.scss';

import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { Form, Button, Dialog } from 'antd-mobile';
import { connect } from 'react-redux';
import { PageLoading } from '@/component/PageLoading';
import BasicUpload from '@/component/BasicUpload';

import setTitle from '@/utility/settitle';
import { appGate } from '@/utility/appGate';
import { useSearchParams } from 'react-router-dom';
// import VConsole from 'vconsole';
// import useGetUserInfo from '../hooks/getUser';

// eslint-disable-next-line no-unused-vars
// const vConsole = new VConsole();

const UploadForm = ({
    defaultValue,
    ticket,
    isBind,
    setIsBind,
    ChangePic,
    ChangeBackPic,
    idcardBack,
    idcardFront,
}) => {
    const [form] = Form.useForm();
    const [first, setFirst] = useState(true);
    let [search] = useSearchParams();
    console.log(search.get('backimg'));

    useEffect(() => {}, []);

    const onFinish = useCallback(
        (values) => {
            console.log(values);
            if (values.picUrl[0].url === '') {
                Dialog.alert({
                    content: '请重新上传正面身份证',
                    confirmText: '确定',
                    onConfirm: () => {},
                });
                return false;
            }
            if (values.picUrlbace[0].url === '') {
                Dialog.alert({
                    content: '请重新上传反面身份证',
                    confirmText: '确定',
                    onConfirm: () => {},
                });
                return false;
            }
            if (
                values.picUrl[0].url !== '' &&
                values.picUrlbace[0].url !== ''
            ) {
                Dialog.alert({
                    content: '上传成功',
                    confirmText: '确定',
                    onConfirm: () => {
                        ChangePic(values.picUrl[0].url2);
                        ChangeBackPic(values.picUrlbace[0].url2);
                        history.go(-1);
                    },
                });
            }
        },
        [ChangeBackPic, ChangePic],
    );

    const onFinishFailed = useCallback((values) => {
        console.log(values);
    }, []);

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
                        提交
                    </Button>
                }
            >
                <div className="adm-list-item adm-form-item up-label">
                    <div className="adm-list-item-content-prefix">
                        <label
                            className="adm-form-item-label"
                            htmlFor="手持证件照"
                        >
                            身份证
                            <span className="adm-form-item-label-required">
                                *
                            </span>
                        </label>
                    </div>
                </div>
                <Form.Item
                    name="picUrl"
                    getValueFromEvent={normFile}
                    rules={[
                        { required: true, message: '身份证正面扫描件不能为空' },
                    ]}
                >
                    <BasicUpload
                        first={first}
                        setFirst={setFirst}
                        face="up"
                        isBind={isBind}
                        setIsBind={setIsBind}
                        enc={1}
                        ticket={ticket}
                        imgUrlFont={idcardFront || search.get('frontimg')}
                    />
                </Form.Item>
                <p className="o-form-tip">
                    <strong>注：</strong>
                    请上传身份证正面扫描件。
                </p>
                <Form.Item
                    name="picUrlbace"
                    getValueFromEvent={normFile}
                    rules={[
                        { required: true, message: '身份证反面扫描件不能为空' },
                    ]}
                >
                    <BasicUpload
                        first={first}
                        setFirst={setFirst}
                        face="down"
                        isBind={isBind}
                        setIsBind={setIsBind}
                        ticket={ticket}
                        enc={1}
                        imgUrlFont={idcardBack || search.get('backimg')}
                    />
                </Form.Item>
                <p className="o-form-tip">
                    <strong>注：</strong>
                    请上传身份证反面扫描件。
                </p>
            </Form>
        </div>
    );
};

const ApplyPage = (props) => {
    let { ticket, ChangePic, ChangeBackPic, idcardBack, idcardFront } = props;

    const [isBind, setIsBind] = useState(false);

    useEffect(() => {
        setTitle('申请签约');

        if (appGate.inApp() && !appGate.inAppIOS()) {
            appGate.IsHavePermission(['photos', 'camera']).then((err) => {
                console.log('apply----' + err);
                console.log(!Number(err));
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
                <UploadForm
                    {...props}
                    ticket={ticket}
                    isBind={isBind}
                    setIsBind={setIsBind}
                    ChangePic={ChangePic}
                    ChangeBackPic={ChangeBackPic}
                    idcardBack={idcardBack}
                    idcardFront={idcardFront}
                />
            </Fragment>
        );
    }
    return <div className="apply-page">{mainContent}</div>;
};

const mapStateTpProps = (state) => {
    return { ...state.user, ...state.apply };
};

const mapDispatchToProps = {
    ChangePic: (phone) => {
        return { type: 'CHANGE_PIC', idcardFront: phone };
    },
    ChangeBackPic: (phone) => {
        return { type: 'CHANGE_BACK_PIC', idcardBack: phone };
    },
};

export default connect(mapStateTpProps, mapDispatchToProps)(ApplyPage);
