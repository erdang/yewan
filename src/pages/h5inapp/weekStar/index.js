import './index.scss';

import React, {
    useState,
    useCallback,
    useEffect,
    Fragment,
    useRef,
} from 'react';
import DawerOverlay from '@/component/DawerOverlay';
import { connect } from 'react-redux';

import CenterOverlay from '@/component/CenterOverlay';
import Portal from '@/component/Protal';
import { Tabs } from 'antd-mobile';

import urlTool from 'ox-util/src/url';
import setTitle from '@/utility/settitle.js';
import { appGate } from '@/utility/appGate.js';
import { APPNAME } from '@/utility/appName';
import instance from '@/request/index';
import { PageLoading } from '@/component/PageLoading';

let hosthome = window.location.hostname;
let imgUrl = APPNAME[hosthome].staticUrl;
const noImg = imgUrl + '/star/no_people.png';

const GIFT_LIST = [
    {
        id: 1,
        name: '礼物冠名(1周)',
        icon: imgUrl + '/star/g_1.png',
        text: '名气榜第1名',
    },
    {
        id: 2,
        name: '头像框',
        icon: imgUrl + '/star/rule_icon4.png',
        text: '魅力,名气榜前3名',
    },
    {
        id: 3,
        name: '全站飘屏',
        icon: imgUrl + '/star/rule_icon3.png',
        text: '魅力榜前3名',
    },
];

const searchParam = urlTool.param(window.location.search);
const buildURL = function (url, params) {
    if (!params) {
        return url;
    }

    // params序列化过程略
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + params;

    return url;
};

const RuleAlert = ({ setShow, tabKeyv, timeCurrent, status }) => {
    const closeAlert = useCallback(() => {
        setShow(false);
    }, [setShow]);
    let liContent = GIFT_LIST.map((item, index) => {
        return (
            <li key={index} data-index={index}>
                <div className="li__gift">
                    <img src={item.icon} alt="" />
                </div>
                <div className="li__select">{item.name}</div>
                <div className="li__name">{item.text}</div>
            </li>
        );
    });

    return (
        <Portal>
            <CenterOverlay className="weekstar-alert" onClose={closeAlert}>
                <div className="title-icon"></div>
                <div className="rule__h1">魅力之星</div>
                <p>
                    1.活动时间为每周一0：00至每周日24：00，按用户收礼数量排名，周日24:00结榜单,认证主播方可上榜；
                </p>
                <p>
                    2.第一名获得奖励（上线全站飘屏提醒、价值1314Z币的礼物、专属头像框7天）；
                    第二名获得奖励（上线全站飘屏提醒、价值1314Z币的礼物、专属头像框5天）
                    第三名获得奖励（上线全站飘屏提醒、价值1314Z币的礼物、专属头像框3天）
                </p>
                <div className="rule__h1">名气之星</div>
                <p>
                    1.活动时间为每周一0：00至每周日24：00，按用户送礼数量排名，周日24:00结榜单,收礼方需是认证主播身份您方可上榜；
                </p>
                <p>
                    2.第一名获得奖励（专属礼物冠名7天、专属头像框7天）；
                    第二名获得奖励（专属头像框5天）第三名获得奖励（专属头像框3天）；
                </p>
                <div className="rule__warp-tab">
                    <div className="warp__tab">
                        <div className="warp__tab-title"></div>
                        <div className="warp__gift">
                            <ul>{liContent}</ul>
                        </div>
                    </div>
                </div>
            </CenterOverlay>
        </Portal>
    );
};

const RankContent = ({ rankData, tabKey }) => {
    const [height, setHeight] = useState(0);
    const measuredRef = useCallback((node) => {
        if (node !== null) {
            setHeight(node.getBoundingClientRect().height + 4);
        }
    }, []);

    const toFunction = useCallback((event) => {
        // let rid = event.currentTarget.dataset.rid;
        let uid = event.currentTarget.dataset.uid;

        if (appGate.inApp()) {
            if (searchParam.room !== 'full') {
                appGate.openProfileCard(uid);
            }
        }
    }, []);

    let divContent = null;
    let liContent = null;
    if (rankData && rankData.rankList.length === 0) {
        liContent = <li className="li__nodata">暂无数据</li>;
    } else if (rankData && rankData.rankList.length > 0) {
        liContent =
            rankData &&
            rankData.rankList.map((item, index) => {
                if (index < 3) {
                    divContent = (
                        <Fragment>
                            <div className="rank__li-pic">
                                <div className="li-pic">
                                    {item.pic ? (
                                        <img src={item.pic} alt="" />
                                    ) : (
                                        <img src={noImg} alt="" />
                                    )}
                                </div>
                            </div>
                            <div className="rank__li-alias">
                                <div>
                                    {item.alias ? item.alias : '虚位以待'}
                                </div>
                            </div>
                            {item.num ? (
                                <Fragment>
                                    <div className="rank__li-num">
                                        {tabKey === '2' ? '送出' : '收到'}
                                        {item.num}个
                                    </div>
                                    <div className="rank__li-icon"></div>
                                </Fragment>
                            ) : null}
                        </Fragment>
                    );
                } else {
                    divContent = (
                        <Fragment>
                            <div className="rank__li-index">{index + 1}</div>
                            <div className="rank__li-info">
                                <div className="rank__li-pic">
                                    {item.pic ? (
                                        <img src={item.pic} alt="" />
                                    ) : (
                                        <img src={noImg} alt="" />
                                    )}
                                </div>
                                <div className="rank__li-user">
                                    <div className="rank__li-alias">
                                        {item.alias ? item.alias : '虚位以待'}
                                    </div>
                                    {item.num ? (
                                        <div className="rank__li-num">
                                            礼物个数：{item.num}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="rank__li-prev">
                                距离上一名：{item.difNum ? item.difNum : '暂无'}
                            </div>
                        </Fragment>
                    );
                }

                return (
                    <li
                        key={index}
                        onClick={toFunction}
                        data-rid={item.rid}
                        data-uid={item.uid}
                    >
                        {divContent}
                    </li>
                );
            });
    }
    return (
        <Fragment>
            {rankData && (
                <div
                    className="weekstar__rank"
                    style={{
                        height: height + 'px',
                    }}
                >
                    <div className="rank__tab" ref={measuredRef}>
                        <div className="rank__tab-content">
                            <ul>{liContent}</ul>
                        </div>
                    </div>
                </div>
            )}

            {Object.keys(rankData.userInfo).length > 0 && (
                <div className="weekstar__my">
                    <div className="rank__li-index">
                        {rankData.userInfo.rank}
                    </div>
                    <div className="rank__li-info">
                        <div className="rank__li-pic">
                            <img src={rankData.userInfo.pic} alt="" />
                        </div>
                        <div className="rank__li-user">
                            <div className="rank__li-alias">
                                {rankData.userInfo.alias}
                            </div>
                        </div>
                    </div>
                    <div className="rank__li-prev">
                        {tabKey === '2' ? '送出' : '收到'}礼物个数：
                        {rankData.userInfo.count}
                    </div>
                </div>
            )}
        </Fragment>
    );
};

const RankTemplate = ({ ticket }) => {
    const [height, setHeight] = useState(0);
    const [showRule, setShowRule] = useState(false);
    const [tabKey, setTabKey] = useState('1');
    const [current, setCurrent] = useState(0);
    const [info, setInfo] = useState('');
    const [rankData, setRankData] = useState('');
    let currentId = useRef(0);

    const measuredRef = useCallback((node) => {
        if (node !== null) {
            setHeight(node.getBoundingClientRect().height + 4);
        }
    }, []);

    const getInfo = useCallback(() => {
        instance.get('/api/starplan/giftList').then((d) => {
            setInfo(d.content);
            currentId.current = d.content[0].propId;
            getRank();
        });
    }, [getRank]);

    const getRank = useCallback(
        (propId) => {
            instance
                .post('/api/starplan/giftRank', {
                    propId: currentId.current,
                    rid: searchParam.ruid,
                    encpass: ticket,
                })
                .then((d) => {
                    setRankData(d.content);
                });
        },
        [ticket],
    );

    const setTabFn = useCallback((key) => {
        setTabKey(key);
    }, []);
    const ruleFn = useCallback((key) => {
        setShowRule(true);
    }, []);

    const liTabFn = useCallback(
        (event) => {
            let index = Number(event.currentTarget.dataset.index);
            let propId = Number(event.currentTarget.dataset.propid);
            setCurrent(index);
            setTabKey('1');

            currentId.current = propId;
            getRank();
        },
        [getRank],
    );

    useEffect(() => {
        setTitle('礼物星球');
        getInfo();
    }, [getInfo]);

    let liContent =
        info &&
        info.map((item, index) => {
            return (
                <li
                    key={index}
                    onClick={liTabFn}
                    data-index={index}
                    data-propid={item.propId}
                >
                    <div className="li__gift">
                        <img src={item.propPic} alt="" />
                    </div>
                    {current === index ? (
                        <div className="li__select ">已选中</div>
                    ) : (
                        <div className="li__select active">去看看</div>
                    )}

                    <div className="li__name">{item.propTitle}</div>
                </li>
            );
        });

    let mainContent = null;
    if (!info) {
        mainContent = <PageLoading />;
    } else if (info && rankData) {
        mainContent = (
            <Fragment>
                <div className="weekstar__warp-banner">
                    <div className="rule__icon" onClick={ruleFn}>
                        活动详情
                    </div>
                </div>
                <div
                    className="weekstar__warp-tab"
                    style={{
                        height: height + 'px',
                    }}
                >
                    <div className="warp__tab" ref={measuredRef}>
                        <div className="warp__tab-title"></div>
                        <div className="warp__gift">
                            <ul>{liContent}</ul>
                        </div>
                    </div>
                </div>
                <div className="tem-tab">
                    <Tabs
                        activeLineMode="fixed"
                        onChange={setTabFn}
                        activeKey={tabKey}
                        style={{
                            '--fixed-active-line-width': '0px',
                            '--content-padding': '0px',
                        }}
                    >
                        <Tabs.Tab
                            title={
                                <div className="text__tab">礼物星魅力榜</div>
                            }
                            key="1"
                        >
                            <RankContent
                                rankData={rankData && rankData.weekInfo}
                                tabKey={tabKey}
                            ></RankContent>
                        </Tabs.Tab>
                        <Tabs.Tab
                            title={
                                <div className="text__tab">礼物星名人堂</div>
                            }
                            key="2"
                        >
                            <RankContent
                                rankData={rankData && rankData.weekUserInfo}
                                tabKey={tabKey}
                            ></RankContent>
                        </Tabs.Tab>
                    </Tabs>
                </div>
            </Fragment>
        );
    }

    return (
        <div
            className={
                'weekstar__warp ' +
                (searchParam.room === 'full' ? 'week__full' : '')
            }
        >
            {mainContent}
            {showRule && <RuleAlert setShow={setShowRule}></RuleAlert>}
        </div>
    );
};

const CommonPaste = ({ page, pageID }) => {
    const openFull = useCallback(() => {
        let url = window.location.origin + window.location.pathname;
        let anc = buildURL(url, 'ruid=' + searchParam.ruid);
        appGate.openUrl(anc, 'headless');
    }, []);

    if (searchParam.type === 'paste') {
        return (
            <div className="paste">
                <div onClick={openFull}></div>
            </div>
        );
    }
};

var WeekStar = function ({ ticket }) {
    if (searchParam.type === 'paste') {
        return <CommonPaste />;
    }
    if (searchParam.room === 'full') {
        return <RankTemplate name={'full'} ticket={ticket} />;
    }

    return (
        <DawerOverlay onClose={appGate.closeWeb} className="weekstar">
            <RankTemplate ticket={ticket} />
        </DawerOverlay>
    );
};
function mapStateTpProps(state) {
    return { ...state.user };
}

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(WeekStar);
