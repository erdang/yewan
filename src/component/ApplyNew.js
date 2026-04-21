import React, {
    Fragment,
    useCallback,
    useEffect,
    useState,
    useRef,
} from 'react';
import { Form, Input, Button, Result, Modal, Dialog } from 'antd-mobile';
import { PageLoading } from '@/component/PageLoading';
import { useNavigate } from 'react-router-dom';

import instance from '@/request/index';
import setTitle from '@/utility/settitle';

import urltool from 'ox-util/src/url.js';
import { appGate } from '@/utility/appGate';

const searchParam = urltool.param(window.location.search);

// import VConsole from 'vconsole';

// eslint-disable-next-line no-unused-vars
// const vConsole = new VConsole();

const ApplyRealeName = ({
    ChangeFromStateNameFn,
    ChangeFromStateIdCardFn,
    defaultValue,
    ticket,
    realNamestatus,
    userInfo,
}) => {
    const canReal = useRef(true);
    const [form] = Form.useForm();
    let navigate = useNavigate();

    useEffect(() => {}, []);

    const onFinish = useCallback(
        (values) => {
            if (canReal.current === false) {
                return;
            }
            canReal.current = false;
            instance
                .post('/api/v1/guild/realname', {
                    token: ticket,
                    name: values.realname,
                    idcard: values.idCard,
                })
                .then((d) => {
                    if (d.code === '200') {
                        window.location.assign(d.content.certify_url);

                        // var iframe = document.createElement('iframe');
                        // iframe.src = d.content.certify_url;
                        // iframe.style.display = 'none';
                        // iframe.style.width = '0px';
                        // iframe.style.height = '0px';
                        // document.body.appendChild(iframe);
                        Modal.confirm({
                            content:
                                '正在尝试打开支付宝 。您将在「支付宝」中完成实名认证。请确保此手机上已经安装了最新版本的「支付宝」。',
                            onConfirm: () => {
                                window.location.reload();
                            },
                            confirmText: '我已认证',
                            cancelText: '认证失败',
                            closeOnMaskClick: false,
                        });
                    }
                    canReal.current = true;
                })
                .catch(function (error) {
                    canReal.current = true;
                });
        },
        [ticket],
    );

    const onFinishFailed = useCallback((values) => {
        //alert(values);
        console.log(values);
    }, []);

    let fContent = null;

    if (realNamestatus === '0') {
        fContent = (
            <div className="apply-form">
                <div className="form-title">实名认证</div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
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
                            color="primary"
                            className="c-button"
                            onClick={() => {
                                form.submit();
                            }}
                        >
                            支付宝认证
                        </Button>
                    }
                >
                    <Form.Item
                        name="realname"
                        label="真实姓名"
                        rules={[{ required: true, message: '姓名不正确' }]}
                    >
                        <Input placeholder="请输入真实姓名" />
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
                        <Input placeholder="请输入身份证号" />
                    </Form.Item>
                </Form>
                <div className="no-button">
                    <Button
                        block
                        type="button"
                        className="out-button"
                        fill="outline"
                        style={{ '--background-color': '#fff' }}
                        onClick={() => {
                            //form.submit();
                            let purl = window.location.origin + '/apply';

                            if (appGate.inApp() && !appGate.inAppIOS()) {
                                if (searchParam.ver >= '1.7.0') {
                                    appGate.CommonEvent({
                                        method: 'toPageH5',
                                        param: {
                                            url: purl,
                                            otherParam: '',
                                        },
                                    });
                                } else {
                                    Dialog.alert({
                                        content: '请更新版本',
                                        bodyClassName: 'dialog-suer',
                                        confirmText: '确定',
                                        onConfirm: () => {
                                            appGate.closeWeb();
                                        },
                                    });
                                }
                            } else {
                                navigate('/apply');
                            }
                        }}
                    >
                        无法使用支付宝，点此认证
                    </Button>
                </div>
            </div>
        );
    } else if (realNamestatus === '1') {
        fContent = (
            <div className="apply-form">
                <div className="form-title">实名认证</div>
                <Result
                    status="waiting"
                    title="认证成功"
                    description="恭喜您，实名认证成功"
                />
            </div>
        );
    }

    return <Fragment>{fContent}</Fragment>;
};

const ApplyNew = (props) => {
    let { ticket, userInfo } = props;
    const [realNamestatus, setRealNamestatus] = useState('');

    const getInfo = useCallback(() => {
        instance
            .post('/api/v1/guild/isRealname', {
                token: ticket,
            })
            .then((d) => {
                setRealNamestatus(d.content.isRealname);
            });
    }, [ticket]);

    const getResult = useCallback(() => {
        return instance.post('/api/v1/guild/checkRealname', {
            token: ticket,
        });
    }, [ticket]);

    useEffect(() => {
        setTitle('实名认证');
        if (searchParam.eid === '100') {
            getResult().then((d) => {
                if (d.code === '200') {
                    getInfo();
                }
            });
        } else {
            getInfo();
        }
    }, [ticket, getInfo, getResult]);

    let mainContent = null;

    if (!ticket || realNamestatus === '') {
        mainContent = <PageLoading />;
    } else {
        mainContent = (
            <Fragment>
                <ApplyRealeName
                    {...props}
                    ticket={ticket}
                    realNamestatus={realNamestatus}
                    userInf={userInfo}
                />
            </Fragment>
        );
    }
    return <div className="apply-page">{mainContent}</div>;
};

export default ApplyNew;
