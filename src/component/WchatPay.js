import React, { useEffect, useState, useCallback } from 'react';
import { Input, Toast, Dialog, Result, Button } from 'antd-mobile';

import { PageLoading } from '@/component/PageLoading';
import instance from '@/request/index';
import setTitle from '@/utility/settitle';
import urltool from 'ox-util/src/url';
import browser from 'ox-util/src/browser';

let moneyUnit = '金币';
let appname = '椰壳';
// const WAY = [
//     {
//         name: '微信支付',
//         type: 'wechatH5',
//     },
//     {
//         name: '支付宝支付',
//         type: 'alipayWap',
//     },
// ];
const WAY_WECHAT = [
    {
        name: '微信支付',
        type: '15', //公众号
        gtype: 'wechatPub', //公众号
    },
    // {
    //     name: '支付宝支付',
    //     gtype: 'alipayWap',
    //     type: '19',
    // },
];

const searchParam = urltool.param(window.location.search);

let WAY_ARR = searchParam.event_parma ? WAY_WECHAT : WAY_WECHAT;

const Manager = ({ ticket, userInfo }) => {
    const [uid, setUid] = useState(localStorage.getItem('angell__Id') || '');
    const [info, setInfo] = useState('');
    const [money, setMoney] = useState('');
    const [currentIndex, setCurrentIndex] = useState('');
    const [currentInput, setCurrentInput] = useState(false);
    const [showBao, setShowBao] = useState(false);
    let [current, setCurrent] = useState(0);

    const getMoneyList = useCallback(() => {
        return instance
            .post('/api/v1/user/getGoldConfig', {
                token: ticket,
            })
            .then((d) => {
                setInfo(d.content);
                // console.log(localStorage.getItem('angell_openid'));

                // Dialog.alert({
                //     title: '用户信息授权',
                //     content: '为了更好的体验，请先授权',
                //     confirmText: '确定',
                //     onConfirm: () => {},
                // });
            });
    }, [ticket]);

    const uidChangFn = useCallback((value) => {
        localStorage.setItem('angell__Id', value);
        setUid(value);
    }, []);

    const moneyChangFn = useCallback((value) => {
        setMoney(/^-?\d+$/.test(value) ? value : '');
    }, []);

    const focusFn = useCallback((value) => {
        setCurrentInput(true);
        setCurrentIndex('');
    }, []);

    const blurFn = useCallback((value) => {
        setCurrentInput(false);
    }, []);

    const liFn = useCallback((event) => {
        let index = Number(event.currentTarget.dataset.index);
        setMoney('');
        setCurrentIndex(index);
    }, []);

    const getById = useCallback(() => {
        return instance.post('/api/v1/pay/getAccountInfo', {
            account_id: uid,
        });
    }, [uid]);

    const createOrderFn = useCallback(
        ({
            money,
            gatetype,
            ovalue,
            openid,
            token,
            uid = '',
            mid = '',
            cate_type,
        }) => {
            return instance.post('/api/v1/pay/createOrderByPublic', {
                money: money,
                type: gatetype,
                ovalue: ovalue,
                openid: openid,
                token: token,
                uid: uid,
                mid: mid,
                cate_type: cate_type,
            });
        },
        [],
    );

    const wechatPay = useCallback(
        ({ appId, timeStamp, nonceStr, signType, packages, paySign, purl }) => {
            // eslint-disable-next-line no-undef
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                    appId: appId, //公众号名称，由商户传入
                    timeStamp: timeStamp, //时间戳，自1970年以来的秒数
                    nonceStr: nonceStr, //随机串
                    package: packages, //prepay_id用等式的格式
                    signType: signType, //微信签名方式：
                    paySign: paySign, //微信签名
                },
                function (res) {
                    if (res.err_msg === 'get_brand_wcpay_request:ok') {
                        window.location.href = purl;

                        // 支付成功 返回成功页
                    } else {
                        Dialog.confirm({
                            content: '是否完成支付',
                            confirmText: '已完成支付',
                            onConfirm: () => {
                                window.location.href = purl;
                            },
                            cancelText: '未完成支付',
                            onCancel: () => {
                                window.location.href = purl;
                            },
                        });
                        //  取消支付或者其他情况 get_brand_wcpay_request:cancel get_brand_wcpay_request:fail
                    }
                },
            );
        },
        [],
    );

    const onBridgeReady = useCallback(() => {
        getById().then((s) => {
            if (s.code === '200') {
                Dialog.confirm({
                    content: `是否要为${s.content.nickname}充值`,
                    confirmText: '确认',
                    onConfirm: () => {
                        //userInfo.id === s.content.uid 当前登录用户给自己充 userId，代充replaceUid
                        let gatetype = WAY_ARR[current].type;
                        let parms = {
                            money:
                                currentIndex === ''
                                    ? money
                                    : info[currentIndex].money,
                            gatetype: gatetype,
                            ovalue:
                                currentIndex === ''
                                    ? money * 10
                                    : info[currentIndex].number,
                            openid: searchParam.event_parma,
                            token:
                                gatetype === '15' || gatetype === '19'
                                    ? ''
                                    : ticket,
                            uid: s.content.uid,
                            mid: searchParam.mid || '',
                            cate_type: 'pay_h5',
                        };
                        createOrderFn(parms).then((d) => {
                            if (d.code === '200') {
                                let purl =
                                    window.location.origin +
                                    window.location.pathname +
                                    '?type=success&orderid=' +
                                    d.content.orderId;

                                if (gatetype === '19') {
                                    window.location.assign(d.content.param);
                                } else if (gatetype === 'alipayWap') {
                                    var alipayFormContainer =
                                        document.createElement('div');
                                    var oldOne =
                                        document.getElementById('alipay-form');

                                    if (oldOne) {
                                        oldOne.parentNode.removeChild(oldOne);
                                    }
                                    alipayFormContainer.id = 'alipay-form';
                                    alipayFormContainer.innerHTML =
                                        d.content.data;
                                    alipayFormContainer.style.visibility =
                                        'hidden';
                                    document.body.appendChild(
                                        alipayFormContainer,
                                    );
                                    setTimeout(() => {
                                        var form =
                                            document.getElementById(
                                                'alipaysubmit',
                                            );
                                        form && form.submit();
                                    }, 100);
                                } else if (gatetype === '15') {
                                    let wparam = {
                                        appId: d.content.param.appId, //公众号名称，由商户传入
                                        timeStamp: d.content.param.timeStamp, //时间戳，自1970年以来的秒数
                                        nonceStr: d.content.param.nonceStr, //随机串
                                        packages: d.content.param.package, //prepay_id用等式的格式
                                        signType: d.content.param.signType, //微信签名方式：
                                        paySign: d.content.param.paySign, //微信签名
                                        purl: purl,
                                    };
                                    wechatPay(wparam);
                                }
                            }
                        });
                    },
                    cancelText: '取消',
                    onCancel: () => {},
                });
            }
        });
    }, [
        money,
        currentIndex,
        info,
        getById,
        createOrderFn,
        wechatPay,
        ticket,
        current,
    ]);

    const chargeFn = useCallback(() => {
        if (uid === '') {
            Toast.show('请输入id');
            return;
        }
        if (money === '' && currentIndex === '') {
            Toast.show('请选择金额或输入金额');
            return;
        }
        if (browser.iswechat()) {
            if (searchParam.event_parma) {
                if (typeof WeixinJSBridge == 'undefined') {
                    if (document.addEventListener) {
                        document.addEventListener(
                            'WeixinJSBridgeReady',
                            onBridgeReady(),
                            false,
                        );
                    } else if (document.attachEvent) {
                        document.attachEvent(
                            'WeixinJSBridgeReady',
                            onBridgeReady(),
                        );
                        document.attachEvent(
                            'onWeixinJSBridgeReady',
                            onBridgeReady(),
                        );
                    }
                } else {
                    onBridgeReady();
                }
            } else {
                onBridgeReady();
            }
        } else {
            onBridgeReady();
        }
    }, [uid, money, currentIndex, onBridgeReady]);

    let listContent =
        info &&
        info.map((item, index) => {
            return (
                <li
                    className={currentIndex === index ? 'active' : ''}
                    key={index}
                    onClick={liFn}
                    data-index={index}
                >
                    <div className="zuan">
                        <div className="zuan-icon"></div>
                        <div className="num">{item.number}</div>
                    </div>
                    <div className="rmb">￥{item.money}</div>
                </li>
            );
        });

    const getPayTypeFn = useCallback((event) => {
        let index = Number(event.currentTarget.dataset.index);
        setCurrent(index);
        if (index === 1) {
            setShowBao(true);
        } else {
            setShowBao(false);
        }
    }, []);

    const maskFn = useCallback(() => {
        setShowBao(false);
    }, []);

    useEffect(() => {
        setTitle('充值');
        getMoneyList();

        // wechatsdk.ready();
    }, [getMoneyList]);

    let mainContent = null;
    if (!info) {
        mainContent = <PageLoading></PageLoading>;
    } else {
        mainContent = (
            <div className="manager-info">
                <div className="title">
                    <div className="logo"></div>
                    <div className="input-info">
                        <div className="name">{appname}账号</div>
                        <div className="uid-input">
                            <Input
                                placeholder="( 请输入ID )"
                                onChange={uidChangFn}
                                value={uid}
                            ></Input>
                        </div>
                    </div>
                </div>
                {/* {browser.iswechat() ? null : (
                    <UserInfo ticket={ticket} userInfo={userInfo} />
                )} */}
                <div className="money-warp">
                    <div className="title-money">充值金额</div>
                    <div className="money-list">
                        <ul>{listContent}</ul>
                    </div>
                    <div
                        className={
                            currentInput === true
                                ? 'input-money active'
                                : 'input-money'
                        }
                    >
                        <div className="m-input">
                            <Input
                                placeholder="请输入充值整数金额(元)"
                                onChange={moneyChangFn}
                                value={money}
                                onBlur={blurFn}
                                onFocus={focusFn}
                                type="number"
                            ></Input>
                        </div>
                    </div>
                </div>
                <div className="pay-way">
                    <div className="title-way">支付方式：</div>
                    <div className="wap__ul">
                        {WAY_ARR.map((item, index) => {
                            return (
                                <div
                                    className={
                                        'way ' +
                                        (current === index ? 'active' : '')
                                    }
                                    key={index}
                                    data-gatetype={item.type}
                                    data-index={index}
                                    onClick={getPayTypeFn}
                                >
                                    <div
                                        className={'w-icon_' + item.gtype}
                                    ></div>
                                    <div className="w-text"> {item.name}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="w-btn" onClick={chargeFn}>
                    立即充值
                </div>
                <div className="tips">
                    1元=10{moneyUnit}，购买{moneyUnit}后不可提现，合理消费
                </div>
                {showBao && browser.iswechat() && (
                    <div className="down-mask" onClick={maskFn}>
                        <div className="tips-icon"></div>
                    </div>
                )}
            </div>
        );
    }

    return <div className="manager">{mainContent}</div>;
};

const Success = () => {
    const [infoOrder, setInfoOrder] = useState('');
    const getOrder = useCallback(() => {
        instance
            .get('/api/v1/pay/getOrderResult', {
                params: {
                    orderid: searchParam.orderid,
                },
            })
            .then((d) => {
                setInfoOrder(d.content);
            });
    }, []);

    let sContent = null;
    if (infoOrder.result === '1') {
        sContent = <Result status="success" title="支付成功" />;
    } else if (infoOrder.result === '0') {
        sContent = <Result status="error" title="支付失败" />;
    } else {
        sContent = <Result status="success" title="查询中" />;
    }

    useEffect(() => {
        setTimeout(() => {
            getOrder();
        }, 1500);
    }, [getOrder]);
    return (
        <div>
            {sContent}
            {browser.iswechat() ? null : (
                <Button
                    block
                    type="button"
                    color="primary"
                    onClick={() => {
                        window.location.href =
                            window.location.origin + '/wchatPay';
                    }}
                >
                    返回充值页面
                </Button>
            )}
        </div>
    );
};

const ErrFailed = () => {
    return <div>支付失败</div>;
};

export { Success, ErrFailed };
export default Manager;
