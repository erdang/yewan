import './index.scss';
import React, {
    useEffect,
    useState,
    useCallback,
    Fragment,
    useRef,
} from 'react';
import { Input, Toast, Result, Button, Dialog } from 'antd-mobile';
import { useLocation } from 'react-router-dom';
import { PageLoading } from '@/component/PageLoading';

import { connect } from 'react-redux';

import instance from '@/request/index';
import setTitle from '@/utility/settitle';
import urltool from 'ox-util/src/url';
import browser from 'ox-util/src/browser';
import user from '@/utility/user';

import openInstall from '@/utility/openinstall';
import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;

let moneyUnit = APPNAME[hostname].money;

const searchParam = urltool.param(window.location.search);

// import VConsole from 'vconsole';
// import useGetUserInfo from '../hooks/getUser';

// eslint-disable-next-line no-unused-vars
// const vConsole = new VConsole();

// let weChat = '';

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

    return url;
};
const WAY = [
    {
        name: '微信支付',
        gatetype: 'wechatH5',
        mid: 1627860053,
    },
    {
        name: '支付宝支付',
        gatetype: 'helibaoH5',
        mid: '100',
    },
];

const PayWayContent = ({ WAY }) => {
    let params = useLocation();
    let param = urltool.param(decodeURI(params.search));
    const canReal = useRef(true);
    const timer = useRef(null);

    const createOrderFn = useCallback(
        ({ gatetype, token, orderid, money, ovalue, mid, src, code }) => {
            return instance.post(
                'https://api.yuewankeji.top/api/v1/pay/createOrder',
                {
                    gatetype: gatetype,
                    mid: mid,
                    token: token,
                    orderid: orderid,
                    money: money,
                    ovalue: ovalue,
                    src: src,
                    code: code,
                },
            );
        },
        [],
    );
    // uid=1000100&ovalue=100&money=10&setp=2&alias=%25E5%25B8%2588%25E6%2580%2580%25E8%2593%259D%253F&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3d3cueWl5YXl1bi5jb20iLCJpYXQiOjE2NzAzMjEzODMsImV4cCI6MTY3MDMyNDk4MywiYXVkIjoxMDAwMTAwLCJzdWIiOjEwLCJjb2luIjoxMDAsIm9pZCI6IjEyMjEyMDYxODA5NDM1MzQifQ.rMDJ2NuJe_l5hudU9cmZIWbpuGTdhVeFJdyNqW8teBA&oid=1221206180943534

    const chargeFn = useCallback(() => {
        if (canReal.current === false) {
            return;
        }
        canReal.current = false;
        // console.log(333);
        // eslint-disable-next-line no-undef
        ap.getAuthCode(
            {
                appId: '2021004123623067',
                scopes: ['auth_user'],
            },
            (res) => {
                const { authCode = '' } = res;
                // console.log(res);
                // 2、通过后端获取tradeNO
                createOrderFn({
                    money: searchParam.money,
                    ovalue: searchParam.ovalue,
                    gatetype: 'helibaoH5',
                    mid: '100',
                    code: authCode,
                    replaceUid: searchParam.uid,
                    token: searchParam.token,
                    orderid: searchParam.oid,
                }).then((d) => {
                    // console.log(d);
                    if (d.code === '200') {
                        // eslint-disable-next-line no-undef
                        AlipayJSBridge.call(
                            'tradePay',
                            {
                                tradeNO: d.content.param.tradeNO,
                            },
                            (result) => {
                                // console.log(result);
                                const { resultCode = '' } = result;
                                if (resultCode == '9000') {
                                    // 支付成功
                                    Dialog.alert({
                                        content: '支付成功',
                                        confirmText: '确定',
                                        onConfirm: () => {},
                                    });
                                }
                            },
                        );
                    }
                });
            },
        );
        timer.current = setTimeout(() => {
            canReal.current = true;
        }, 500);

        //1533360191
    }, [createOrderFn]);
    return (
        <Fragment>
            <div className="money__info">
                <div className="money__info-money">
                    <span>¥</span>
                    {param.money}
                </div>
            </div>
            <div className={'money__user'}>
                <section className="label">账号：</section>
                <section className="main">
                    <span>{param.alias + '(' + param.uid + ')'}</span>
                </section>
            </div>

            <div className="w-btn" onClick={chargeFn}>
                立即支付
            </div>
        </Fragment>
    );
};

const ManagerNext = ({ ticket, userInfo, WAY, step2Url }) => {
    useEffect(() => {
        setTitle('充值');
        const oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.src =
            'https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min.js';
        document.body.appendChild(oScript);
    }, []);

    useEffect(() => {}, []);

    return (
        <div className="manager">
            <PayWayContent WAY={WAY}></PayWayContent>
        </div>
    );
};

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

const Manager = ({ ticket, userInfo, WAY, step2Url }) => {
    // let userInfo = useGetUserInfo(ticket);
    console.log(userInfo);

    const [step, setStep] = useState(() => {
        return Number(searchParam.setp) || 1;
    }); //1 选择充值金额 2 支付方式 下单
    const [info, setInfo] = useState('');
    const [money, setMoney] = useState(() => {
        return searchParam.m || '';
    });
    const [currentIndex, setCurrentIndex] = useState('');
    const [currentInput, setCurrentInput] = useState(false);

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
    const createpaytokFn = useCallback(
        (money, ovalue) => {
            return instance.post('/api/v1/pay/genToken', {
                money: money,
                coin: ovalue,
                token: ticket,
                type: '2',
            });
        },
        [ticket],
    );

    const chargeFn = useCallback(async () => {
        if (money === '' && currentIndex === '') {
            Toast.show('请选择金额或输入金额');
            return;
        }
        let pmoney = currentIndex === '' ? money : info[currentIndex].money;

        let povalue =
            currentIndex === '' ? money * 10 : info[currentIndex].number;

        console.log(info);

        Dialog.confirm({
            content: `是否要为${userInfo.nickname}(${userInfo.rid})充值`,
            confirmText: '确认',
            onConfirm: async () => {
                createpaytokFn(pmoney, povalue).then((d) => {
                    if (d.code === '200') {
                        let url = buildURL(
                            'https://dev-h5.yuewankeji.top/helibaoPay/middlePage?type=helibao',
                            [
                                'uid=' + userInfo.uid,
                                'ovalue=' + povalue,
                                'money=' + pmoney,

                                'alias=' + userInfo.nickname,
                                'token=' + d.content.token,
                                'oid=' + d.content.oid,
                            ],
                        );
                        window.location.href =
                            'alipays://platformapi/startapp?saId=10000007&qrcode=' +
                            encodeURIComponent(url);
                    }
                });
            },
            cancelText: '取消',
            onCancel: () => {},
        });
    }, [money, currentIndex, info, userInfo, createpaytokFn]);

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
                    1元=10Z币，购买Z币后不可提现，合理消费
                </div>
            </div>
        ),
        2: <PayWayContent WAY={WAY}></PayWayContent>,
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
    var openInstallRef = useRef(null);

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
    const [infoOrder, setInfoOrder] = useState('');
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

const PageMain = ({ ticket, userInfo }) => {
    if (searchParam.type === 'success') {
        return <Success></Success>;
    }
    if (searchParam.type === 'faileed') {
        return <ErrFailed></ErrFailed>;
    }
    if (searchParam.type === 'helibao') {
        return <ManagerNext></ManagerNext>;
    }
    return <Manager ticket={ticket} userInfo={userInfo} WAY={WAY}></Manager>;
};
const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(PageMain);
