import React, { useCallback, useEffect } from 'react';
import { Outlet, useOutlet, useNavigate, useMatch } from 'react-router-dom';
import { connect } from 'react-redux';

import setTitle from '@/utility/settitle';
import { appGate } from '@/utility/appGate';
import instance from '@/request/index';
import { Dialog } from 'antd-mobile';

const PageOp = ({ ticket, info }) => {
    let navigate = useNavigate();

    const toMoneyFn = useCallback(
        (event) => {
            let url = event.currentTarget.dataset.url;
            navigate(url);
        },
        [navigate],
    );
    const toOpenFn = useCallback(() => {
        instance
            .post('/operation/newEconomy/h5url', {
                encpass: ticket,
            })
            .then((f) => {
                if (f.flag === '001') {
                    if (appGate.inApp() && !appGate.inAppIOS()) {
                        appGate.CommonEvent({
                            method: 'appOpenUrlFromH5',
                            param: {
                                url: f.content.h5_url,
                                otherParam: '',
                            },
                        });
                    } else {
                        location.assign(f.content.h5_url);
                    }
                }
            });
    }, [ticket]);

    useEffect(() => {
        setTitle('我的后台');
    }, []);
    return (
        <div className="user-op">
            <div className="op-list">
                <div
                    className="list-li"
                    onClick={toMoneyFn}
                    data-url="/op/incomeList"
                >
                    收入查询
                </div>
                <div
                    className="list-li"
                    onClick={toMoneyFn}
                    data-url="/op/flowDetails"
                >
                    收入统计
                </div>
                <div
                    className="list-li"
                    onClick={toMoneyFn}
                    data-url="/op/liveTime"
                >
                    直播时长
                </div>
                {/* <div
                    className="list-li"
                    onClick={toMoneyFn}
                    data-url="/op/getrRecord"
                >
                    主持人钻石抽成查询
                </div> */}
                <div
                    className="list-li"
                    onClick={toMoneyFn}
                    data-url="/op/manager"
                >
                    主持人管理
                </div>
                {
                    <div
                        className="list-li"
                        onClick={toMoneyFn}
                        data-url="/op/getCash"
                    >
                        提现
                    </div>
                }
                <div
                    className="list-li"
                    onClick={toMoneyFn}
                    data-url="/op/getCashLog"
                >
                    提现记录
                </div>
                <div
                    className="list-li"
                    onClick={toMoneyFn}
                    data-url="/op/addBank"
                >
                    添加银行卡
                </div>
                <div
                    className="list-li"
                    onClick={toMoneyFn}
                    data-url="/op/sayHi"
                >
                    打招呼设置
                </div>
                <div
                    className="list-li"
                    onClick={toMoneyFn}
                    data-url="/op/addManger"
                >
                    我的公会
                </div>
                {info.withdrawalWhite === '1' && (
                    <div className="list-li" onClick={toOpenFn}>
                        注册个体户
                    </div>
                )}

                {/* <div className="list-li"></div> */}
            </div>
            <div className="op-tilte">上传证件</div>
            <div className="op-list">
                <div
                    className="list-li"
                    onClick={toMoneyFn}
                    data-url="/op/uploadCard"
                >
                    上传身份证扫描件
                </div>
                <div
                    className="list-li"
                    onClick={toMoneyFn}
                    data-url="/op/uploadInvoice"
                >
                    上传发票
                </div>
            </div>
        </div>
    );
};

const OperationIndex = ({ ticket }) => {
    let key = useOutlet();
    let currentRoute = useMatch('/op');

    //var ua = window.navigator.userAgent;

    useEffect(() => {
        setTitle('我的后台');

        currentRoute && Dialog.clear();
    }, [currentRoute]);

    let mainContent = null;
    if (appGate.inApp() && appGate.inAppIOS()) {
        mainContent = <PageOp ticket={ticket} />;
    } else {
        mainContent = <PageOp ticket={ticket} />;
    }

    return (
        <div className="op-index">
            {key === null ? mainContent : <Outlet />}
        </div>
    );
};
const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(OperationIndex);
