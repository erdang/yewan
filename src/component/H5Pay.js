import React, {
    useEffect,
    useState,
    useCallback,
    Fragment,
    useRef,
} from 'react';
import { Input, Toast, Result, Button } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';

import { PageLoading } from '@/component/PageLoading';
import instance from '@/request/index';
import setTitle from '@/utility/settitle';
import urltool from 'ox-util/src/url';
import browser from 'ox-util/src/browser';
import user from '@/utility/user';
import { APPNAME } from '@/utility/appName';
import openInstall from '@/utility/openinstall';

const hostname = window.location.hostname;

let moneyUnit = APPNAME[hostname].money;

const searchParam = urltool.param(window.location.search);

// import VConsole from 'vconsole';
// import useGetUserInfo from '../hooks/getUser';

const buildURL = function (url, params) {
    if (!params) {
        return url;
    }

    // params序列化过程略
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + params.join('&');

    return encodeURI(url);
};

// // eslint-disable-next-line no-unused-vars
// const vConsole = new VConsole();

const UserInfo = ({ userInfo, ticket, info }) => {
    const changeUser = useCallback(() => {
        user.toLogin();
    }, []);

    return (
        <div className="user-div">
            <div className={'apply-user-info border-bottom'}>
                <section className="label">当前用户：</section>
                <section className="main">
                    <span>{userInfo.alias}</span>
                    <span>({userInfo.rid})</span>
                    <span onClick={changeUser}>更换</span>
                </section>
            </div>
            <section className="amount">
                <section className="label">当前余额：</section>
                <section>
                    {info.coin}
                    {moneyUnit}
                </section>
            </section>
        </div>
    );
};

// let weChat = '';

const PayWayContent = ({ WAY, ticket }) => {
    let params = useLocation();
    let param = urltool.param(decodeURI(params.search));

    let [current, setCurrent] = useState(0);
    const createOrderFn = useCallback(
        ({ gatetype, token, orderid, money, ovalue, mid, src, encpass }) => {
            return instance.post('/api/pay/createOrder', {
                gatetype: gatetype,
                mid: mid,
                token: token,
                orderid: orderid,
                money: money,
                ovalue: ovalue,
                src: src,
                encpass: encpass,
            });
        },
        [],
    );

    const getPayTypeFn = useCallback((event) => {
        let index = Number(event.currentTarget.dataset.index);
        setCurrent(index);
    }, []);

    const chargeFn = useCallback(() => {
        //1533360191
        createOrderFn({
            gatetype: WAY[current].gatetype,
            token: param.token,
            orderid: param.oid,
            ovalue: param.ovalue,
            money: param.money,
            mid: WAY[current].mid,
            src: searchParam.src,
            encpass: ticket,
        }).then((d) => {
            if (d.code === '200') {
                let purl =
                    window.location.origin +
                    window.location.pathname +
                    '?type=success&orderid=' +
                    d.content.orderId +
                    '&src=' +
                    searchParam.src;

                if (WAY[current].gatetype === 'wechatH5') {
                    window.location.assign(
                        d.content.data.h5Url +
                            '&redirect_url=' +
                            encodeURIComponent(purl),
                    );
                } else if (WAY[current].gatetype === 'alipayWap') {
                    var alipayFormContainer = document.createElement('div');
                    var oldOne = document.getElementById('alipay-form');

                    if (oldOne) {
                        oldOne.parentNode.removeChild(oldOne);
                    }
                    alipayFormContainer.id = 'alipay-form';
                    alipayFormContainer.innerHTML = d.content.data;
                    alipayFormContainer.style.visibility = 'hidden';
                    document.body.appendChild(alipayFormContainer);
                    setTimeout(() => {
                        var form = document.getElementById('alipaysubmit');
                        form && form.submit();
                    }, 100);
                } else if (WAY[current].gatetype === 'unionPayH5') {
                    window.location.assign(d.content.data.payUrl);
                }
            }
        });
    }, [createOrderFn, current, param, WAY, ticket]);
    return (
        <Fragment>
            <div className="money__info">
                <div className="money__info-money">
                    <span>¥</span>
                    {param.money}
                </div>
            </div>
            {param.oid && (
                <div className={'money__user'}>
                    <section className="label">订单号：</section>
                    <section className="main">
                        <span>{param.oid}</span>
                    </section>
                </div>
            )}

            <div className="pay-way">
                <div className="title-way">支付方式：</div>
                <div className="wap__ul">
                    {WAY.map((item, index) => {
                        return (
                            <div
                                className={
                                    'way ' + (current === index ? 'active' : '')
                                }
                                key={index}
                                data-gatetype={item.gatetype}
                                data-index={index}
                                onClick={getPayTypeFn}
                            >
                                <div
                                    className={'w-icon_' + item.gatetype}
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
        </Fragment>
    );
};

const Manager = ({ ticket, userInfo, WAY, step2Url }) => {
    // let userInfo = useGetUserInfo(ticket);

    const [step, setStep] = useState(() => {
        return Number(searchParam.setp) || 1;
    }); //1 选择充值金额 2 支付方式 下单
    const [info, setInfo] = useState('');
    const [money, setMoney] = useState(() => {
        return searchParam.m || '';
    });
    const [currentIndex, setCurrentIndex] = useState('');
    const [currentInput, setCurrentInput] = useState(false);

    let navigate = useNavigate();

    let location = useLocation();

    const getMoneyList = useCallback(() => {
        return instance
            .post('/api/v1/user/getGoldConfig', {
                token: ticket,
            })
            .then((d) => {
                setInfo(d.content);
            });
    }, [ticket]);

    const moneyChangFn = useCallback((value) => {
        setMoney(value);
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

    const chargeFn = useCallback(async () => {
        if (money === '' && currentIndex === '') {
            Toast.show('请选择金额或输入金额');
            return;
        }
        let pmoney =
            currentIndex === '' ? money : info.azPayMoneyList[currentIndex].rmb;

        let povalue =
            currentIndex === ''
                ? money * 10
                : info.azPayMoneyList[currentIndex].coin;

        // localStorage.setItem('orderId', infoToken.content.oid);
        let url = buildURL('/' + step2Url + '/from', [
            'uid=' + userInfo.id,
            'ovalue=' + povalue,
            'money=' + pmoney,
            'setp=2',
            'alias=' + encodeURIComponent(userInfo.alias),
        ]);
        setStep(2);
        navigate(url);
    }, [money, currentIndex, navigate, info, userInfo, step2Url]);

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
                        <div className="num">{item.number + moneyUnit}</div>
                    </div>
                    <div className="rmb">￥{item.money}</div>
                </li>
            );
        });

    let stepContent = {
        1: (
            <div className="manager-info">
                {ticket === 'null' || !ticket ? null : (
                    <UserInfo ticket={ticket} userInfo={userInfo} info={info} />
                )}

                <div className="money-warp">
                    <div className="title-money">充值金额：</div>
                    {searchParam.m && searchParam.r ? null : (
                        <div className="money-list">
                            <ul>{listContent}</ul>
                        </div>
                    )}

                    <div
                        className={
                            currentInput === true
                                ? 'input-money active'
                                : 'input-money'
                        }
                    >
                        <div className="m-input">
                            <div className="m__price">￥</div>
                            <Input
                                placeholder="请输入充值金额(元)"
                                onChange={
                                    searchParam.m ? () => {} : moneyChangFn
                                }
                                value={money}
                                onBlur={searchParam.m ? () => {} : blurFn}
                                onFocus={searchParam.m ? () => {} : focusFn}
                            ></Input>
                            <div className="m__price">元</div>
                        </div>
                    </div>
                </div>
                <div className="next-btn" onClick={chargeFn}>
                    下一步
                </div>
                <div className="tips">
                    1元=10{moneyUnit}，购买{moneyUnit}后不可提现，合理消费
                </div>
            </div>
        ),
        2: <PayWayContent WAY={WAY} ticket={ticket}></PayWayContent>,
    };

    useEffect(() => {
        setTitle('充值');
        getMoneyList();
    }, [getMoneyList]);

    useEffect(() => {
        let params = urltool.param(location.search);
        if (!location.search || params.m || params.mid) {
            setStep(1);
        }
    }, [location]);

    let mainContent = null;
    if (!info) {
        mainContent = <PageLoading></PageLoading>;
    } else {
        mainContent = stepContent[step];
    }

    return <div className="manager">{mainContent}</div>;
};

const Success = ({ step2Url }) => {
    const [infoOrder, setInfoOrder] = useState('');
    const [info, setInfo] = useState('start');
    var openInstallRef = useRef(null);
    let timer1 = useRef(null);
    let timer2 = useRef(null);

    useEffect(() => {
        openInstall({
            channelCode: '8888',
            extraParam: {
                spage: '1',
                spageid: '90708034',
                router: '',
            },
        }).then((oi) => {
            openInstallRef.current = oi;
            // oi.schemeWakeup();
        });
    }, []);

    const getOrder = useCallback(() => {
        instance
            .get('/api/pay/getOrderResult', {
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
        if (info === 'failed') {
            sContent = <Result status="error" title="充值失败" />;
        } else {
            sContent = <Result status="error" title="充值中" />;
        }
    } else {
        sContent = <Result status="success" title="查询中" />;
    }

    useEffect(() => {
        return () => {
            if (timer1.current) {
                clearInterval(timer1.current);
            }
            if (timer2.current) {
                clearTimeout(timer2.current);
            }
        };
    }, []);

    useEffect(() => {
        timer1.current = setInterval(() => {
            getOrder();
        }, 1000);
        timer2.current = setTimeout(() => {
            if (timer1.current) {
                clearInterval(timer1.current);
                setInfo('failed');
                // setInfoOrder(() => {
                //     return { result: '3' };
                // });
            }
        }, 6000);
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
                        if (searchParam.src === 'emo') {
                            if (openInstallRef.current) {
                                openInstallRef.current.wakeupOrInstall();
                            }
                        } else {
                            window.location.href =
                                window.location.origin +
                                '/' +
                                step2Url +
                                '?mid=' +
                                searchParam.mid;
                        }
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
