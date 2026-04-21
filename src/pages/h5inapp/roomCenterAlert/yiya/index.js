import './index.scss';

import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd-mobile';
import CenterOverlay from '@/component/CenterOverlay';
import { PageLoading } from '@/component/PageLoading';

import { appGate } from '@/utility/appGate';
import urltool from 'ox-util/src/url.js';
import instance from '@/request/index';
import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;
const money = APPNAME[hostname].money;
const unit = APPNAME[hostname].unit;

// import VConsole from 'vconsole';

// const vConsole = new VConsole();

const searchParam = urltool.param(window.location.search);

const GIFT_INFO = {
    19: {
        name: '白天使魔盒',
        icon: '',
        text: '参与概率获得10倍专属库存奖励【白昼天使】',
        price: `50${money}`,
    },
    21: {
        name: '黑天使魔盒',
        icon: '',
        text: '参与概率获得10倍专属库存奖励【暗夜天使】',
        price: `50${money}`,
    },
};

const BlackProcess = ({ ticket }) => {
    console.log(ticket);
    // if (!searchParam.event_data) {
    //     alert('event_data,不存在');
    // }
    const [eventData, setEventData] = useState('');

    const getInitFn = useCallback(
        (data) => {
            instance
                .post('/api/gift/propProgress', {
                    encpass: ticket,
                    propid: searchParam.propid,
                })
                .then((d) => {
                    if (d.code === '200') {
                        setEventData(d.content);
                    }
                });
        },
        [ticket],
    );

    const openUrl = useCallback((data) => {
        let url =
            window.location.origin + window.location.pathname + '?type=help';
        console.log(url);
        appGate.openUrl(url, 'headless');
    }, []);

    let styleWidth = (eventData.progress / eventData.total) * 100 + '%';

    useEffect(() => {
        appGate.listen('3388').then((data) => {
            if (data.content.typeID === '3388') {
                setEventData(data.content.content);
            }
        });
        getInitFn();
    }, [getInitFn]);

    let mainContent = null;
    if (Object.keys(eventData).length > 0) {
        mainContent = (
            <div className="process-bg">
                <div className={'process-icon' + eventData.propid}></div>
                <div className="process-info">
                    <div className="info-name">
                        {GIFT_INFO[eventData.propid].name}
                        <span> {GIFT_INFO[eventData.propid].price}</span>
                    </div>
                    <div className="info-text">
                        {GIFT_INFO[eventData.propid].text}
                    </div>
                </div>
                <div className="progress-div">
                    <div className="active" style={{ width: styleWidth }}></div>
                    <div className="progress-num">
                        {eventData.progress}/{eventData.total}
                    </div>
                </div>
                <div className="help" onClick={openUrl}></div>
            </div>
        );
    } else if (Object.keys(eventData).length === 0) {
        mainContent = <PageLoading />;
    }

    return <div className="black-process">{mainContent}</div>;
};

var Help = function () {
    return (
        <CenterOverlay
            className="northeast-boy-help"
            onClose={appGate.closeWeb}
        >
            <p>活动规则</p>
            <p>
                &gt;在宝箱中选择“白昼天使”或“暗夜天使”参与活动，有几率获得对应价值10倍的库存礼物；
            </p>
            <p>
                &gt;参与活动时，同一礼物连续参与19次均未获得，将在参与第20次时获得一个库存礼物作为奖励；
            </p>
            <p>
                &gt;参与活动不论是否中奖，收礼主播都将获得礼物2%{unit}奖励，即1
                {unit}。
            </p>
            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th>获得礼物</th>
                            <th>礼物价值（{money}）</th>
                            <th>概率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>白昼天使</td>
                            <td>520</td>
                            <td>10%</td>
                        </tr>
                        <tr>
                            <td>暗夜天使</td>
                            <td>520</td>
                            <td>10%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                &gt;奖励礼物存放到您的礼物宝箱—库存，其中天使系列库存礼物，自获得之日起7日内有效，到期清空。
            </p>
        </CenterOverlay>
    );
};

const ResultCmp = () => {
    // if (!searchParam.event_data) {
    //     alert('event_data,不存在');
    // }
    const [eventData] = useState(() => {
        let result = '';
        try {
            result = JSON.parse(decodeURIComponent(searchParam.event_data));
        } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
                result = JSON.parse(
                    decodeURIComponent(
                        '%7B%22content%22%3A%22%5Cu60a8%5Cu5f53%5Cu524d%5Cu5185%5Cu5bb9%5Cu8fdd%5Cu89c4%5Cuff0c%5Cu8bf7%5Cu53ca%5Cu65f6%5Cu8c03%5Cu6574%5Cu3002%22%7D',
                    ),
                );
            }
        }
        return result;
    });

    return (
        <CenterOverlay className="black-result" onClose={appGate.closeWeb}>
            <div className="black-result-conetnt">
                <div className="b__icon">
                    <svg
                        t="1682394302875"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="6561"
                        width="200"
                        height="200"
                    >
                        <path
                            d="M1001.661867 796.544c48.896 84.906667 7.68 157.013333-87.552 157.013333H110.781867c-97.834667 0-139.050667-69.504-90.112-157.013333l401.664-666.88c48.896-87.552 128.725333-87.552 177.664 0l401.664 666.88zM479.165867 296.533333v341.333334a32 32 0 1 0 64 0v-341.333334a32 32 0 1 0-64 0z m0 469.333334v42.666666a32 32 0 1 0 64 0v-42.666666a32 32 0 1 0-64 0z"
                            fill="#f4ea2a"
                            p-id="6562"
                        ></path>
                    </svg>
                </div>

                <div className="b__text">{eventData.content}</div>
                <div
                    className="b__btn"
                    onClick={() => {
                        appGate.closeWeb();
                    }}
                >
                    确定
                </div>
            </div>
        </CenterOverlay>
    );
};

const Home = ({ ticket }) => {
    console.log(ticket);
    useEffect(() => {
        return () => {};
    }, []);

    const openFull = useCallback(() => {
        appGate.openUrl('http://develop-suer-mobile.6.cn/', 'headless');
    }, []);

    if (searchParam.type === 'paste') {
        return (
            <div className="paste">
                <div>
                    <Button onClick={openFull}>打开webview</Button>
                </div>
            </div>
        );
    }
    if (searchParam.type === 'center') {
        return <BlackProcess ticket={ticket} />;
    }
    if (searchParam.type === 'Help') {
        return <Help />;
    }
    if (searchParam.type === 'warn') {
        return <ResultCmp />;
    }
};

function mapStateTpProps(state) {
    return { ...state.user };
}

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(Home);
