import './index.scss';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { Form, Input, Button, Checkbox, Dialog } from 'antd-mobile';
import { PageLoading } from '@/component/PageLoading';
import { connect } from 'react-redux';
import CenterOverlay from '@/component/CenterOverlay';
import Portal from '@/component/Protal';

import instance from '@/request/index';
import setTitle from '@/utility/settitle';

import { appGate } from '@/utility/appGate';

const AlertRule = ({ setShowRule, surl }) => {
    const backFn = useCallback(() => {
        setShowRule(false);
    }, [setShowRule]);

    return (
        <Portal>
            <CenterOverlay className="help__grade" onClose={backFn}>
                <iframe src={surl.url}></iframe>
            </CenterOverlay>
        </Portal>
    );
};

const CheckboxContent = ({ value = {}, onChange, setShowRule, info }) => {
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
        setShowRule(true);
    }, [setShowRule]);
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
            我已阅读并同意,<span onClick={toRule}>{info.title}</span>
        </Checkbox>
    );
};

const ApplyForm = ({
    ChangeFromStateNameFn,
    ChangeFromStateIdCardFn,
    defaultValue,
    ticket,
}) => {
    const [form] = Form.useForm();
    const [show, setShow] = useState(false);
    const [showRule, setShowRule] = useState(false);
    const [info, setInfo] = useState('');

    useEffect(() => {
        // Toast.show(isBind);
    }, []);

    const getHetong = useCallback(
        ({ realname, idCard }) => {
            instance
                .post('/api/v1/user/yzhUserContract', {
                    token: ticket,
                    real_name: realname,
                    id_card: idCard,
                })
                .then((d) => {
                    if (d.code === '200') {
                        setShow(true);
                        setInfo(d.content);
                    }
                });
        },
        [ticket],
    );

    const onFinish = useCallback(
        (values) => {
            if (show) {
                instance
                    .post('/api/v1/user/yzhUserSign', {
                        token: ticket,
                        real_name: values.realname,
                        id_card: values.idCard,
                    })
                    .then((d) => {
                        if (d.code === '200') {
                            Dialog.alert({
                                content: '签约成功',
                                bodyClassName: 'dialog-suer',
                                confirmText: '确定',
                                onConfirm: () => {
                                    appGate.closeWeb();
                                },
                            });
                        }
                    });
            } else {
                getHetong(values);
            }
        },
        [ticket, getHetong, show],
    );

    const onFinishFailed = useCallback((values) => {
        //alert(values);
        console.log(values);
    }, []);

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
    const normCheckBox = (e) => {
        return e.hasRule;
    };

    return (
        <div className="apply-form">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={defaultValue}
                className="ignore"
                footer={
                    <Fragment>
                        {show ? (
                            <Button
                                block
                                type="button"
                                className="c-button"
                                color="primary"
                                onClick={() => {
                                    form.submit();
                                }}
                            >
                                签约
                            </Button>
                        ) : (
                            <Button
                                block
                                type="button"
                                className="b-button"
                                color="primary"
                                onClick={() => {
                                    form.submit();
                                }}
                            >
                                生成灵活就业合作伙伴协议
                            </Button>
                        )}
                    </Fragment>
                }
            >
                <Form.Item
                    name="realname"
                    label="真实姓名"
                    className="form__list"
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
                    className="form__list"
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
                {show ? (
                    <Form.Item
                        getValueFromEvent={normCheckBox}
                        name="《灵活就业合作伙伴协议》"
                        className="form__list"
                        rules={[
                            {
                                required: true,
                                message: '《灵活就业合作伙伴协议》',
                            },
                        ]}
                    >
                        <CheckboxContent
                            ruleText={'《灵活就业合作伙伴协议》'}
                            type="userRule"
                            ticket={ticket}
                            form={form}
                            info={info}
                            setShowRule={setShowRule}
                        />
                    </Form.Item>
                ) : null}
            </Form>
            {showRule && (
                <AlertRule surl={info} setShowRule={setShowRule}></AlertRule>
            )}
        </div>
    );
};

const ApplyPage = (props) => {
    let { realname, idCard, ticket } = props;
    let [defaultValue] = useState(() => {
        return {
            realname,
            idCard,
        };
    });

    useEffect(() => {
        setTitle('签约共享经济');
    }, [ticket]);

    let mainContent = null;

    if (!ticket) {
        mainContent = <PageLoading />;
    } else {
        mainContent = (
            <Fragment>
                <ApplyForm
                    {...props}
                    defaultValue={defaultValue}
                    ticket={ticket}
                />
            </Fragment>
        );
    }
    return <div className="sign__page">{mainContent}</div>;
};
const mapStateTpProps = (state) => {
    return { ...state.user, ...state.apply };
};

const mapDispatchToProps = {
    ChangeFromStateNameFn: (realname) => {
        return { type: 'CHANGE_NAME', realname };
    },
    ChangeFromStateIdCardFn: (idCard) => {
        return { type: 'CHANGE_IDCARD', idCard };
    },
};

export default connect(mapStateTpProps, mapDispatchToProps)(ApplyPage);
