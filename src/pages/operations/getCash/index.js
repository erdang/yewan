import './index.scss';

import React, {
    useCallback,
    useEffect,
    useState,
    Fragment,
    useReducer,
    memo,
} from 'react';
import { Form, Button, Input, Dialog, Radio, Space } from 'antd-mobile';
import { Outlet, useOutlet, useMatch, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import instance from '@/request/index';
import setTitle from '@/utility/settitle';
import { base64Decode } from '@/utility/crypto';
import Base64 from 'ox-util/src/base_atob';
// import useGetUserInfo from '@/hooks/getUser';
import { PageLoading } from '@/component/PageLoading';

const ApplyForm = memo(({ ticket, defaultValue, dispatch, info, infoData }) => {
    // const uInfo = useGetUserInfo(ticket);
    const [form] = Form.useForm();

    // let navigate = useNavigate();

    // const toUp = useCallback(() => {
    //     navigate(
    //         `/getCash/uploadCard?backimg=` +
    //             encodeURIComponent(info.idcard_back) +
    //             '&frontimg=' +
    //             encodeURIComponent(info.idcard_front),
    //     );
    // }, [navigate, info]);

    useEffect(() => {}, []);
    const getCashMethod = Form.useWatch('getCashMethod', form);

    const onFinish = useCallback(
        (values) => {
            console.log(values);
            instance
                .post('/api/v1/pay/withdraw', {
                    token: ticket,
                    diamond: values.count,
                    type: values.getCashMethod,
                    cardNo: values.bankNum,
                    bank: values.bandAdress,
                    name: values.name,
                    idCard: values.idCard,
                    // idCardBack: defaultValue.idcardBack || info.idcard_back,
                    // idCardFront: defaultValue.idcardFront || info.idcard_front,
                    mobile:
                        values.getCashMethod === '1'
                            ? values.bankMobile
                            : values.alipayMobile,
                    aliAccount: values.alipayNum,
                })
                .then((d) => {
                    if (d.code === '200') {
                        Dialog.alert({
                            content: d.content,
                            confirmText: '确定',
                        });
                    }
                });
        },
        [ticket],
    );

    const onFinishFailed = useCallback((values) => {
        console.log(values);
    }, []);

    return (
        <>
            <div className="title">
                <div className="title__info">
                    <div className="title__info-icon">
                        {infoData && infoData.available_diamond}
                    </div>
                    <div className="title__info-num">钻石余额</div>
                </div>
                <div className="title__info-text">
                    <div className="title__info-text1">
                        {infoData && infoData.available_diamond / 10}
                    </div>
                    <div className="title__info-text2"> 可提现金额(元)</div>
                </div>
            </div>
            <div className="apply-form">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className="ignore"
                    initialValues={{
                        getCashMethod:
                            (info && String(info.type)) ||
                            defaultValue.getCashMethod,
                        name: defaultValue.name || (info && info.name),
                        bankNum: defaultValue.bankNum || (info && info.bank_no),
                        bandAdress:
                            defaultValue.bandAdress || (info && info.bank_name),
                        bankMobile:
                            defaultValue.bankMobile || (info && info.mobile),
                        idCard: defaultValue.idCard || (info && info.idcard),
                        count: defaultValue.count,
                        alipayNum:
                            defaultValue.alipayNum || (info && info.aliAccount),
                        alipayMobile:
                            defaultValue.alipayMobile || (info && info.mobile),
                        // idcardBack:
                        //     defaultValue.idcardBack ||
                        //     (info && info.idcard_back),
                        // idcardFront:
                        //     defaultValue.idcardFront ||
                        //     (info && info.idcard_front),
                    }}
                    footer={
                        <Fragment>
                            <Button
                                block
                                type="submit"
                                color="primary"
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
                                className="c-button"
                                onClick={(e) => {
                                    form.submit();
                                }}
                            >
                                提交
                            </Button>
                        </Fragment>
                    }
                >
                    <Form.Item
                        className="form__list"
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '姓名不能为空' }]}
                    >
                        <Input
                            placeholder="请输入真实姓名"
                            onChange={(val) => {
                                dispatch({
                                    type: 'nameChange',
                                    payload: {
                                        name: val,
                                    },
                                });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="getCashMethod"
                        label="请选择你的提现方式"
                        className="form__list"
                    >
                        <Radio.Group
                            onChange={(val) => {
                                dispatch({
                                    type: 'cashMethodChange',
                                    payload: {
                                        cashMethod: val,
                                    },
                                });
                            }}
                        >
                            <Space>
                                <Radio
                                    value="1"
                                    icon={(checked) => (
                                        <div className="check__icon2"></div>
                                    )}
                                >
                                    银行卡
                                </Radio>
                            </Space>
                            <Space className="space__radio">
                                <Radio
                                    value="2"
                                    icon={(checked) => (
                                        <div className="check__icon1"></div>
                                    )}
                                >
                                    支付宝
                                </Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                    <>
                        {getCashMethod === '1' && (
                            <>
                                <Form.Item
                                    name="bankNum"
                                    label="银行卡号"
                                    className="form__list"
                                    rules={[
                                        {
                                            required: true,
                                            message: '银行卡号不能为空',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="请输入银行卡号"
                                        type="number"
                                        onChange={(val) => {
                                            dispatch({
                                                type: 'bankNumChange',
                                                payload: {
                                                    bankNum: val,
                                                },
                                            });
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="bandAdress"
                                    label="银行开户支行"
                                    className="form__list"
                                    rules={[
                                        {
                                            required: true,
                                            message: '银行开户支行不能为空',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="请输入银行开户支行"
                                        onChange={(val) => {
                                            dispatch({
                                                type: 'bandAdressChange',
                                                payload: {
                                                    bandAdress: val,
                                                },
                                            });
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="bankMobile"
                                    label="手机号"
                                    type="number"
                                    className="form__list"
                                    rules={[
                                        {
                                            required: true,
                                            message: '手机号不能为空',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="请输入与银行卡绑定的手机号"
                                        onChange={(val) => {
                                            dispatch({
                                                type: 'bankMobileChange',
                                                payload: {
                                                    bankMobile: val,
                                                },
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </>
                        )}
                        {getCashMethod === '2' && (
                            <>
                                <Form.Item
                                    name="alipayNum"
                                    label="支付宝账号"
                                    className="form__list"
                                    rules={[
                                        {
                                            required: true,
                                            message: '支付宝账号不能为空',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="请输入支付宝账号"
                                        onChange={(val) => {
                                            dispatch({
                                                type: 'alipayNumChange',
                                                payload: {
                                                    alipayNum: val,
                                                },
                                            });
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="alipayMobile"
                                    label="手机号"
                                    className="form__list"
                                    type="number"
                                    rules={[
                                        {
                                            required: true,
                                            message: '手机号不能为空',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="请输入与支付宝账号对应的手机号"
                                        onChange={(val) => {
                                            dispatch({
                                                type: 'alipayMobileChange',
                                                payload: {
                                                    alipayMobile: val,
                                                },
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </>
                        )}
                    </>
                    <Form.Item
                        name="idCard"
                        label="身份证号"
                        className="form__list"
                        rules={[
                            { required: true, message: '身份证号不能为空' },
                        ]}
                    >
                        <Input
                            placeholder="请输入身份证号"
                            onChange={(val) => {
                                dispatch({
                                    type: 'idCardChange',
                                    payload: {
                                        idCard: val,
                                    },
                                });
                            }}
                        />
                    </Form.Item>

                    {/* <Form.Item
                        name="idcardBack"
                        label="上传身份证"
                        rules={[{ required: true, message: '身份证不能为空' }]}
                    >
                        <div onClick={toUp} className="red__span">
                            {info.idcard_back
                                ? info.idcard_back === '' &&
                                    info.idcard_front === ''
                                    ? '去上传'
                                    : '重新上传'
                                : defaultValue.idcardBack === '' &&
                                    defaultValue.idcardFront === ''
                                    ? '去上传'
                                    : '重新上传'}
                        </div>
                    </Form.Item> */}

                    <Form.Item
                        name="count"
                        label="提现钻石"
                        className="form__list"
                        rules={[{ required: true, message: '提现钻石' }]}
                    >
                        <Input placeholder="提现钻石" onChange={(val) => {}} />
                    </Form.Item>

                    <div className="get_tips">
                        注：提现金额100元起提,手续费6%
                    </div>
                </Form>
            </div>
        </>
    );
});
const reducer = function (state, action) {
    switch (action.type) {
        case 'nameChange': {
            return {
                ...state,
                name: action.payload.name,
            };
        }
        case 'cashMethodChange': {
            return {
                ...state,
                getCashMethod: action.payload.cashMethod,
            };
        }
        case 'bankNumChange': {
            return {
                ...state,
                bankNum: action.payload.bankNum,
            };
        }
        case 'bandAdressChange': {
            return {
                ...state,
                bandAdress: action.payload.bandAdress,
            };
        }
        case 'bankMobileChange': {
            return {
                ...state,
                bankMobile: action.payload.bankMobile,
            };
        }
        case 'idCardChange': {
            return {
                ...state,
                idCard: action.payload.idCard,
            };
        }

        case 'alipayNumChange': {
            return {
                ...state,
                alipayNum: action.payload.alipayNum,
            };
        }
        case 'alipayMobileChange': {
            return {
                ...state,
                alipayMobile: action.payload.alipayMobile,
            };
        }
    }
    throw Error('Unknown action:' + action.type);
};

const Manager = ({ ticket, idcardBack, idcardFront }) => {
    const createInitialState = function () {
        return {
            name: '',
            getCashMethod: '1',
            bankNum: '',
            bandAdress: '',
            bankMobile: '',
            alipayNum: '',
            alipayMobile: '',
            idCard: '',
            count: '',
            idcardBack: idcardBack,
            idcardFront: idcardFront,
        };
    };

    let currentRoute = useMatch('/getCash');
    let navigate = useNavigate();

    const [statea, dispatch] = useReducer(reducer, createInitialState());

    const [info, setInfo] = useState('');
    const [infoData, setInfoData] = useState('');

    const getStatus = useCallback(() => {
        return instance.post('/api/v1/user/yzhUserCheck', {
            token: ticket,
        });
    }, [ticket]);
    const getInfo = useCallback(() => {
        getStatus().then((s) => {
            if (s.code === '200') {
                if (s.content.status === '1') {
                    instance
                        .post('/api/v1/pay/withdrawInit', {
                            token: ticket,
                        })
                        .then((d) => {
                            let dav = d.content.data;
                            if (d.code === '200') {
                                let dataInfso = JSON.parse(
                                    Base64.decode(
                                        decodeURIComponent(base64Decode(dav)),
                                    ),
                                );
                                console.log(dataInfso);

                                setInfo(dataInfso);
                                setInfoData(d.content);
                            }
                        });
                } else {
                    navigate('/signWork');
                }
            }
        });
    }, [ticket, getStatus, navigate]);

    useEffect(() => {
        setTitle('提现');

        currentRoute && Dialog.clear();
    }, [currentRoute]);
    useEffect(() => {
        getInfo();
    }, [getInfo]);

    let mainContent = null;

    if (!info) {
        mainContent = <PageLoading />;
    } else if (info) {
        mainContent = (
            <Fragment>
                <div className="tem-tab">
                    <ApplyForm
                        ticket={ticket}
                        defaultValue={{
                            ...statea,
                            idcardBack,
                            idcardFront,
                        }}
                        dispatch={dispatch}
                        info={info}
                        infoData={infoData}
                    ></ApplyForm>
                </div>
            </Fragment>
        );
    }

    return (
        <div className="manager">
            <div className="manager-info">{mainContent}</div>
        </div>
    );
};

const MainPage = ({ ticket, idcardBack, idcardFront }) => {
    let key = useOutlet();

    useEffect(() => {}, []);
    return (
        <div className="manager">
            <div className="manager-info">
                {key === null ? (
                    <Manager
                        ticket={ticket}
                        idcardBack={idcardBack}
                        idcardFront={idcardFront}
                    ></Manager>
                ) : (
                    <Outlet />
                )}
            </div>
        </div>
    );
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

export default connect(mapStateTpProps, mapDispatchToProps)(MainPage);
