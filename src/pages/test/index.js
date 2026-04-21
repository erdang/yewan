import React, { useEffect, useCallback, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd-mobile';
import { callMethod, appGate } from '../../utility/appGate';
import openInstall from '@/utility/openinstall';
// import VConsole from 'vconsole';
// /*eslint-disable*/
// const vConsole = new VConsole();

const Home = () => {
    const [ticket, setTicket] = useState('');
    var openInstallRef = useRef(null);

    useEffect(() => {
        openInstall({
            channelCode: '8888',
            extraParam: {
                params: {
                    route: 'RoomsViewRoute',
                    param: {
                        uid: '1000038',
                        nextType: 'upmic',
                    },
                },
            },
        }).then((oi) => {
            openInstallRef.current = oi;
            // oi.schemeWakeup();
        });
    }, []);

    const getEncFn = useCallback(() => {
        const getInfo = (msg) => {
            setTicket(JSON.stringify(msg));
        };
        setTicket('');
        callMethod({
            method: 'getEncpass',
            params: {},
            callback: getInfo,
        });
    }, []);

    const toLoginFn = useCallback(() => {
        callMethod({
            method: 'appGuestLogin',
            params: {},
            callback: '',
        });
    }, []);

    //   normal	顶部带导航的 webview
    // headless	全屏背景透明的 webview，就是弹窗系统常用的那种
    // others	其他类型的 webview

    const openFull = useCallback(() => {
        appGate.openUrl('http://develop-suer-mobile.6.cn/', 'headless');
    }, []);

    const openHalfFull = useCallback((url) => {
        appGate.openUrl('http://develop-suer-mobile.6.cn/', 'normal');
    }, []);

    const listenFn = useCallback(() => {
        appGate.listen('320', '413').then((data) => {
            alert(data);
        });
    }, []);

    const sendFn = useCallback(() => {
        var param = {
            t: '1',
            r: '1',
            i: '1',
            n: 1,
        };
        appGate.sendMsg('prop_prop', param);
    }, []);

    const openPay = useCallback(() => {
        appGate.openPayPage(10, '123');
    }, []);

    const toRoom = useCallback(() => {
        appGate.openRoom('1', '1');
    }, []);

    const shareFn = useCallback(() => {
        appGate.shareFn();
    }, []);

    const closeWeb = useCallback(() => {
        appGate.closeWeb();
    }, []);

    const openCard = useCallback(() => {
        appGate.openProfileCard('1', 'room');
    }, []);

    const openGift = useCallback(() => {
        appGate.openGiftStore({
            giftID: '10',
            target: {
                uid: '84455931',
                rid: '81667865',
                alias: 'mr',
            },
        });
    }, []);
    const openP = useCallback(() => {
        appGate.IsHavePermission(['photos', 'camera'], (err) => {
            if (err === '0') {
                alert('无权限');
            } else {
                alert('有权限');
            }
        });
    }, []);
    const openIs = useCallback(() => {
        console.log(appGate.inAppIOS() + '------' + appGate.inAppAndroid());
    }, []);
    const openIM = useCallback(() => {
        appGate.openIm('1000100', '1');
    }, []);
    const reportEvent = useCallback(() => {
        appGate.CommonEvent({
            method: 'reportEventFromH5',
            param: {
                key: 'key',
                eventName: 'click',
            },
        });
    }, []);
    const toRouteFn = useCallback(() => {
        appGate.CommonEvent({
            method: 'H5toAppRoute',
            param: {
                route: 'RoomsViewRoute',
                options: {
                    uid: '1000038',
                    nextType: 'giftbox',
                    nextParam: { id: '1' },
                },
            },
        });
    }, []);
    const getRoominfo = useCallback(() => {
        appGate
            .CommonEvent({
                method: 'getRoomInfo',
            })
            .then((s) => {
                console.log(s);
            });
    }, []);
    const openRouteFn = useCallback(() => {
        if (openInstallRef.current) {
            openInstallRef.current.wakeupOrInstall();
        }
    }, []);
    return (
        <div>
            <div>
                <Button onClick={getEncFn}>获取encpass</Button>
                <div>{ticket}</div>
            </div>
            <div>
                <Button onClick={toLoginFn}>去登录并退出</Button>
            </div>
            <div>
                <Button onClick={openFull}>打开全屏webview</Button>
            </div>
            <div>
                <Button onClick={openHalfFull}>打开带导航全屏webview</Button>
            </div>
            <div>
                <Button onClick={listenFn}>监听socket，获取消息</Button>
            </div>
            <div>
                <Button onClick={sendFn}>socket发送消息</Button>
            </div>
            <div>
                <Button onClick={openPay}>打开充值</Button>
            </div>
            <div>
                <Button onClick={toRoom}>跳转房间</Button>
            </div>
            <div>
                <Button onClick={shareFn}>分享</Button>
            </div>
            <div>
                <Button onClick={closeWeb}>关闭webview</Button>
            </div>
            <div>
                <Button onClick={openCard}>打开资料卡</Button>
            </div>
            <div>
                <Button onClick={openGift}>打开礼物宝箱</Button>
            </div>
            <div>
                <Button onClick={openP}>是否有权限</Button>
            </div>
            <div>
                <Button onClick={openIs}>判断平台</Button>
            </div>
            <div>
                <Button onClick={openIM}>打开Im</Button>
            </div>
            <div>
                <Button onClick={reportEvent}>统计上报</Button>
            </div>
            <div>
                <Button onClick={getRoominfo}>获取房间号</Button>
            </div>
            <div>
                <Button onClick={openRouteFn}>打开路由</Button>
            </div>
            <div>
                <Button onClick={toRouteFn}>跳转路由</Button>
            </div>
        </div>
    );
};

function mapStateTpProps(state) {
    return { ...state.home };
}

export default connect(mapStateTpProps)(Home);
