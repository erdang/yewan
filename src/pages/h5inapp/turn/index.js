import './index.scss';

import React, {
    useState,
    useCallback,
    useEffect,
    Fragment,
    useRef,
} from 'react';

import { connect } from 'react-redux';
import { Tabs, InfiniteScroll, Stepper } from 'antd-mobile';

import CenterOverlay from '@/component/CenterOverlay';
import Portal from '@/component/Protal';
import ComTab from '@/component/comTab';
import DawerOverlay from '@/component/DawerOverlay';

import urlTool from 'ox-util/src/url';
import setTitle from '@/utility/settitle.js';
import { appGate } from '@/utility/appGate.js';
import instance, { instanceGame } from '@/request/index';
import { BlockLoading } from '@/component/PageLoading';
import { APPNAME } from '@/utility/appName';
import { Dialog } from 'antd-mobile';
import { format as formatTime } from 'ox-util/src/time';

const searchParam = urlTool.param(window.location.search);
const noTou_Img = APPNAME[window.location.hostname].staticUrl;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const RULE_TABLE_DAY = [
    {
        name: '心跳共振',
        gold: '60金币',
        tourValue: '60',
        tourCoins: '60',
        prob: '33%',
    },
    {
        name: '告白气球',
        gold: '60金币',
        tourValue: '80',
        tourCoins: '80',
        prob: '31%',
    },
    {
        name: '心动纸翼',
        gold: '60金币',
        tourValue: '100',
        tourCoins: '100',
        prob: '24%',
    },
    {
        name: '旅途冰啤',
        gold: '60金币',
        tourValue: '200',
        tourCoins: '200',
        prob: '9.2%',
    },
    {
        name: '玫瑰星云',
        gold: '60金币',
        tourValue: '300',
        tourCoins: '300',
        prob: '2%',
    },
    {
        name: '真爱魔镜',
        gold: '60金币',
        tourValue: '500',
        tourCoins: '500',
        prob: '0.5%',
    },
    {
        name: '余生旅伴',
        gold: '60金币',
        tourValue: '1000',
        tourCoins: '1000',
        prob: '0.2%',
    },
    {
        name: '终点足你',
        gold: '60金币',
        tourValue: '5000',
        tourCoins: '5000',
        prob: '0.1%',
    },
];

const RULE_TABLE_NIGHT = [
    {
        name: '海盐甜吻',
        gold: '100金币',
        tourValue: '100',
        tourCoins: '100',
        prob: '40%',
    },
    {
        name: '夏日甜饮',
        gold: '100金币',
        tourValue: '200',
        tourCoins: '200',
        prob: '34%',
    },
    {
        name: '珊瑚海星',
        gold: '100金币',
        tourValue: '300',
        tourCoins: '300',
        prob: '18%',
    },
    {
        name: '为你盛放',
        gold: '100金币',
        tourValue: '400',
        tourCoins: '400',
        prob: '6%',
    },
    {
        name: '浪漫烟花',
        gold: '100金币',
        tourValue: '500',
        tourCoins: '500',
        prob: '1.1%',
    },
    {
        name: '心动来电',
        gold: '100金币',
        tourValue: '800',
        tourCoins: '800',
        prob: '0.3%',
    },
    {
        name: '蜜恋花园',
        gold: '100金币',
        tourValue: '1000',
        tourCoins: '1000',
        prob: '0.2%',
    },
    {
        name: '星爱巡游',
        gold: '100金币',
        tourValue: '3000',
        tourCoins: '3000',
        prob: '0.2%',
    },
    {
        name: '城堡告白',
        gold: '100金币',
        tourValue: '6000',
        tourCoins: '6000',
        prob: '0.1%',
    },
    {
        name: '月漾星海',
        gold: '100金币',
        tourValue: '10000',
        tourCoins: '10000',
        prob: '0.1%',
    },
];

const RuleAlert = ({ setShow, stagesByTab }) => {
    const closeAlert = useCallback(() => {
        setShow(false);
    }, [setShow]);
    const tabOneIcons = stagesByTab?.['1']?.gifts || [];
    const tabTwoIcons = stagesByTab?.['2']?.gifts || [];

    return (
        <div className="turn_rule_page">
            <div className="turn_rule_page-nav">
                <div className="turn_rule_page-back" onClick={closeAlert}></div>
                <div className="turn_rule_page-title"></div>
            </div>
            <div className="turn_rule_page-body">
                <div className="turn_rule_panel">
                    <div className="turn_rule_sec_title">一、活动玩法</div>
                    <ol className="turn_rule_ol">
                        <li>
                            进入活动选择麦上嘉宾，消耗金币环游可赠送出不同的等价环游礼物。
                        </li>
                        <li>
                            浪漫环游分为浪漫启程（60金币/次）、星夜环游（100金币/次）两个场景。
                        </li>
                        <li>
                            嘉宾收到环游礼物增加礼物对应的环游值，荣登浪漫环游榜，每周/每月排名前列者可获得榜单奖励。
                        </li>
                        <li>
                            赠送环游礼物同时增加对应的环游币，用于在环游商店中兑换奖励。
                        </li>
                        <li>各场景环游礼物及概率如下：</li>
                    </ol>

                    <div className="turn_rule_table_wrap">
                        <table className="turn_rule_table">
                            <thead>
                                <tr>
                                    <th colSpan={5}>浪漫启程</th>
                                </tr>
                                <tr>
                                    <th>礼物名称</th>
                                    <th>礼物价值</th>
                                    <th>环游值</th>
                                    <th>环游币</th>
                                    <th>概率</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RULE_TABLE_DAY.map((item, index) => (
                                    <tr key={`day-${index}`}>
                                        <td>
                                            <div className="turn_rule_gift_name">
                                                <span>{item.name}</span>
                                                <span className="turn_rule_gift_box">
                                                    {tabOneIcons[index]
                                                        ?.icon && (
                                                        <img
                                                            src={
                                                                tabOneIcons[
                                                                    index
                                                                ].icon
                                                            }
                                                            alt=""
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{item.gold}</td>
                                        <td>{item.tourValue}</td>
                                        <td>{item.tourCoins}</td>
                                        <td>{item.prob}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="turn_rule_table_wrap">
                        <table className="turn_rule_table">
                            <thead>
                                <tr>
                                    <th colSpan={5}>星夜环游</th>
                                </tr>
                                <tr>
                                    <th>礼物名称</th>
                                    <th>礼物价值</th>
                                    <th>环游值</th>
                                    <th>环游币</th>
                                    <th>概率</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RULE_TABLE_NIGHT.map((item, index) => (
                                    <tr key={`night-${index}`}>
                                        <td>
                                            <div className="turn_rule_gift_name">
                                                <span>{item.name}</span>
                                                <span className="turn_rule_gift_box">
                                                    {tabTwoIcons[index]
                                                        ?.icon && (
                                                        <img
                                                            src={
                                                                tabTwoIcons[
                                                                    index
                                                                ].icon
                                                            }
                                                            alt=""
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{item.gold}</td>
                                        <td>{item.tourValue}</td>
                                        <td>{item.tourCoins}</td>
                                        <td>{item.prob}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="turn_rule_sec_title">二、活动规范</div>
                    <ol className="turn_rule_ol">
                        <li>未成年人均不得参与本活动的任何付费环节。</li>
                        <li>
                            为维护公平健康的语音交友环境，保障全体用户的合法权益，本平台严禁任何形式的“礼物私下返现”或“礼物回收”行为；一经发现，即视为严重违规，违规者将面临永久封号及法律追责。
                        </li>
                        <li>活动参与过程中有任何疑问可咨询站内客服。</li>
                        <li>本活动规则的最终解释权归【椰壳app】所有。</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

const Resultalert = ({
    setShow,
    currentUser,
    voiceUser,
    sendFn,
    sendRelult,
    linkWithTourAnim = false,
}) => {
    const closeAlert = useCallback(() => {
        setShow(false);
    }, [setShow]);

    let messageContent =
        sendRelult &&
        sendRelult.results.length > 0 &&
        sendRelult.results.map((item, index) => {
            return (
                <li key={index}>
                    <div className="v_gift">
                        <img src={item.giftIcon} alt="" />
                        <div className="v_gift-y">{item.tourValue}环游值</div>
                    </div>
                    <div className="v_gift-p">
                        <span>{item.tourCoins}</span>
                        <span></span>
                    </div>
                    <div className="v_gift-name">{item.giftName}</div>
                </li>
            );
        });

    return (
        <Portal>
            <CenterOverlay
                className={`result-alert ${linkWithTourAnim ? 'result-alert-link' : ''}`}
                onClose={closeAlert}
            >
                <div
                    className={
                        sendRelult.results.length > 1
                            ? 'result-alert-duo'
                            : 'result-alert-one'
                    }
                >
                    <div className="result_user">
                        <div className="result_user_user-2">
                            <img src={voiceUser[currentUser].avatar} alt="" />
                        </div>
                    </div>
                    <div className="r_text1">
                        <div>您已向[</div>
                        <div className="more_alais">
                            {voiceUser[currentUser].nickname}
                        </div>
                        <div>]赠送</div>
                    </div>

                    <div className="v_ul">
                        <ul>{messageContent}</ul>
                    </div>
                    <div className="v_tips">
                        <div className="v-tips1">
                            本次环游共获得
                            <span>
                                {sendRelult && sendRelult.totalTourCoins}
                            </span>
                            环游币
                        </div>
                        <div className="v-tips2">
                            <div>为[</div>
                            <div className="more_alais">
                                {voiceUser[currentUser].nickname}
                            </div>
                            <div>
                                ]增加 {sendRelult && sendRelult.totalTourValue}
                                环游值
                            </div>
                        </div>
                    </div>
                    <div className="r_btns">
                        <div className="rule_a_btn" onClick={closeAlert}></div>
                        <div
                            className="rule_b_btn"
                            onClick={() => {
                                sendFn();
                                closeAlert();
                            }}
                        >
                            <div className="rule_b_btn-div2"></div>
                            <div className="rule_b_btn-div1"></div>
                        </div>
                    </div>
                </div>
            </CenterOverlay>
        </Portal>
    );
};

const RankContent = ({
    data,
    tabKey,
    hasMore,
    currentPage,
    loadMore,
    rankData,
    initialized,
}) => {
    const toFunction = useCallback((event) => {
        // let rid = event.currentTarget.dataset.rid;
        let uid = event.currentTarget.dataset.uid;
        if (uid) {
            appGate.openProfilePage(uid);
        }
    }, []);
    const toRoomFunction = useCallback((event) => {
        // let rid = event.currentTarget.dataset.rid;
        let uid = event.currentTarget.dataset.uid;
        if (uid) {
            appGate.openRoom(uid);
        }
    }, []);
    const isNoData = initialized && data && data.length === 0;

    let liContent = null;
    if (!initialized) {
        liContent = null;
    } else if (data && data.length === 0) {
        liContent = <li className="li__nodata">暂无数据</li>;
    } else if (data && data.length > 0) {
        liContent = data.map((item, index) => {
            return (
                <li key={index}>
                    {index > 2 && <div className="li_index">{index + 1}</div>}
                    <div className="rank_one-info">
                        <div
                            className="one_info-1"
                            onClick={
                                tabKey !== '3' ? toFunction : toRoomFunction
                            }
                            data-uid={item.userId}
                        >
                            <img src={item.userAvatar} alt="" />
                            {index < 3 && <div className="one_info_bg"></div>}
                        </div>
                        <div className="one_info-2">
                            <img src={item.bestContributorAvatar} alt="" />
                            {index < 3 && <div className="one_info_bg"></div>}
                        </div>
                    </div>
                    <div className="rank_one-text">{item.userName}</div>
                    <div className="rank_one-text2">{item.tourValue}环游值</div>
                </li>
            );
        });
    }

    return (
        <Fragment>
            <div className="heart__rank rank_one-warp">
                <div className="rank__tab">
                    <div className="rank__tab-content">
                        <div className="rank_one-tips">
                            收到环游礼物即增加对应的环游值，排名前列获得
                        </div>
                        <ul className={isNoData ? 'is-empty' : ''}>
                            {liContent}
                        </ul>
                        {data.length > 0 && (hasMore || currentPage > 1) && (
                            <InfiniteScroll
                                loadMore={loadMore}
                                hasMore={hasMore}
                                threshold={0}
                            />
                        )}
                    </div>
                </div>
                {rankData.myRank && Object.keys(rankData.myRank).length > 0 && (
                    <div className="weekstar__my">
                        <div className="li_index">
                            {rankData.myRank.rank > 100 ||
                            rankData.myRank.rank === 0
                                ? '未上榜'
                                : rankData.myRank.rank}
                        </div>
                        <div className="rank_one-info">
                            <div
                                className="one_info-1"
                                onClick={
                                    tabKey !== '3' ? toFunction : toRoomFunction
                                }
                                data-uid={rankData.myRank.userId}
                            >
                                <img src={rankData.myRank.userAvatar} alt="" />
                            </div>
                            <div className="one_info-2">
                                <img
                                    src={rankData.myRank.bestContributorAvatar}
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="rank_one-text">
                            {rankData.myRank.name}
                        </div>
                        <div className="rank_one-text2">
                            {rankData.myRank.tourValue}环游值
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

const RankMain = ({ setShowRank, ticket, setShowAward }) => {
    const PAGE_SIZE = 10;
    const buildPageState = () => ({
        items: [],
        page: 0,
        hasMore: true,
        loading: false,
        initialized: false,
        myRank: {},
    });

    const [tabKey, setTabKey] = useState('1');
    const [rankingState, setRankingState] = useState({
        1: buildPageState(),
        2: buildPageState(),
        3: buildPageState(),
    });

    const fetchRankingPage = useCallback(
        (rankingType, page, append) => {
            setRankingState((prev) => ({
                ...prev,
                [rankingType]: {
                    ...prev[rankingType],
                    loading: true,
                },
            }));
            return instanceGame
                .get('/api/tour/ranking', {
                    params: {
                        activityId: 2,
                        page,
                        pageSize: PAGE_SIZE,
                        token: ticket,
                        rankingType,
                    },
                })
                .then((d) => {
                    if (d.code !== '200') return;
                    const items = d?.content?.items || [];
                    setRankingState((prev) => {
                        const oldItems = append ? prev[rankingType].items : [];
                        const nextItems = [...oldItems, ...items];
                        const total = Number(d?.content?.total || 0);
                        return {
                            ...prev,
                            [rankingType]: {
                                ...prev[rankingType],
                                items: nextItems,
                                page,
                                hasMore: nextItems.length < total,
                                loading: false,
                                initialized: true,
                                myRank: d.content.myRank,
                            },
                        };
                    });
                })
                .catch(() => {
                    setRankingState((prev) => ({
                        ...prev,
                        [rankingType]: {
                            ...prev[rankingType],
                            loading: false,
                            initialized: true,
                        },
                    }));
                });
        },
        [ticket],
    );

    const setTabFn = useCallback(
        (key) => {
            setTabKey(key);
            const rankingType = Number(key);
            setRankingState((prev) => ({
                ...prev,
                [rankingType]: buildPageState(),
            }));
            fetchRankingPage(rankingType, 1, false);
        },
        [fetchRankingPage],
    );

    useEffect(() => {
        fetchRankingPage(1, 1, false);
    }, [fetchRankingPage]);

    const currentRankingType = Number(tabKey);
    const currentState = rankingState[currentRankingType] || buildPageState();
    const loadMore = useCallback(() => {
        if (currentState.loading || !currentState.hasMore) {
            return Promise.resolve();
        }
        return fetchRankingPage(
            currentRankingType,
            currentState.page + 1,
            true,
        );
    }, [currentState, currentRankingType, fetchRankingPage]);

    return (
        <div className="heart__rank-warp">
            <div className="rank__nav">
                <div
                    className="rank__rank-icon"
                    onClick={() => {
                        setShowRank(false);
                    }}
                ></div>
                <div className="rank_title"></div>
            </div>
            <div className="tem-tab-warp">
                <div
                    className="rank_bang"
                    onClick={() => {
                        setShowAward(true);
                    }}
                ></div>
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
                            title={<div className="text__tab">上周</div>}
                            key="1"
                        >
                            <RankContent
                                data={rankingState[1].items}
                                tabKey={tabKey}
                                hasMore={rankingState[1].hasMore}
                                currentPage={rankingState[1].page}
                                loadMore={loadMore}
                                rankData={rankingState[1]}
                                initialized={rankingState[1].initialized}
                            ></RankContent>
                        </Tabs.Tab>
                        <Tabs.Tab
                            title={<div className="text__tab">周榜</div>}
                            key="2"
                        >
                            <RankContent
                                data={rankingState[2].items}
                                tabKey={tabKey}
                                hasMore={rankingState[2].hasMore}
                                currentPage={rankingState[2].page}
                                loadMore={loadMore}
                                rankData={rankingState[2]}
                                initialized={rankingState[2].initialized}
                            ></RankContent>
                        </Tabs.Tab>
                        <Tabs.Tab
                            title={<div className="text__tab">月榜</div>}
                            key="3"
                        >
                            <RankContent
                                data={rankingState[3].items}
                                tabKey={tabKey}
                                hasMore={rankingState[3].hasMore}
                                currentPage={rankingState[3].page}
                                loadMore={loadMore}
                                rankData={rankingState[3]}
                                initialized={rankingState[3].initialized}
                            ></RankContent>
                        </Tabs.Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};
const AWARD_ARR_WEEK_TOP = {
    1: [
        {
            gname: '浪漫气泡',
            url: noTou_Img + '/huanyou/gg/langmanqipao.png',
            exp: '7天',
        },
        {
            gname: '靓号积分',
            url: noTou_Img + '/numShop/n6.png',
            exp: '2000',
        },
    ],
    2: [
        {
            gname: '浪漫气泡',
            url: noTou_Img + '/huanyou/gg/langmanqipao.png',
            exp: '7天',
        },
    ],
    3: [
        {
            gname: '浪漫气泡',
            url: noTou_Img + '/huanyou/gg/langmanqipao.png',
            exp: '3天',
        },
    ],
};

const AWARD_ARR_MONTH_TOP = {
    1: [
        {
            gname: '浪漫之翼座驾',
            url: noTou_Img + '/huanyou/gg/langmanzhiyi_zuojia.png',
            exp: '30天',
        },
        {
            gname: '靓号积分',
            url: noTou_Img + '/numShop/n6.png',
            exp: '3000',
        },
    ],
    2: [
        {
            gname: '浪漫之翼座驾',
            url: noTou_Img + '/huanyou/gg/langmanzhiyi_zuojia.png',
            exp: '7天',
        },
    ],
    3: [
        {
            gname: '浪漫之翼座驾',
            url: noTou_Img + '/huanyou/gg/langmanzhiyi_zuojia.png',
            exp: '3天',
        },
    ],
};
const AwardContent = ({ AWARD_ARR_WEEK }) => {
    return (
        <div className="awawrd_conetnt">
            <div className="awawrd_div1 awawrd_div">
                <div className="awawrd_div-title1"></div>
                <ul>
                    {AWARD_ARR_WEEK[1].map((item, index) => {
                        return (
                            <li key={index}>
                                <div className="awawrd_gift">
                                    <img src={item.url} alt="" />
                                    <div className="awawrd_gift-span">
                                        {item.exp}
                                    </div>
                                </div>
                                <div className="awawrd_gift-name">
                                    {item.gname}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="awawrd_div2 awawrd_div">
                <div className="awawrd_div-title"></div>
                <ul>
                    {AWARD_ARR_WEEK[2].map((item, index) => {
                        return (
                            <li key={index}>
                                <div className="awawrd_gift">
                                    <img src={item.url} alt="" />
                                    <div className="awawrd_gift-span">
                                        {item.exp}
                                    </div>
                                </div>
                                <div className="awawrd_gift-name">
                                    {item.gname}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="awawrd_div3 awawrd_div">
                <div className="awawrd_div-title"></div>
                <ul>
                    {AWARD_ARR_WEEK[3].map((item, index) => {
                        return (
                            <li key={index}>
                                <div className="awawrd_gift">
                                    <img src={item.url} alt="" />
                                    <div className="awawrd_gift-span">
                                        {item.exp}
                                    </div>
                                </div>
                                <div className="awawrd_gift-name">
                                    {item.gname}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
const RankAward = ({ setShowAward, ticket }) => {
    const [tabKey, setTabKey] = useState('1');
    const setTabFn = useCallback((key) => {
        setTabKey(key);
    }, []);

    return (
        <div className="heart__award">
            <div className="rank__nav">
                <div
                    className="rank__rank-icon"
                    onClick={() => {
                        setShowAward(false);
                    }}
                ></div>
                <div className="rank_title"></div>
            </div>
            <div className="tem-tab-warp">
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
                            title={<div className="text__tab">周榜</div>}
                            key="1"
                        >
                            <AwardContent
                                AWARD_ARR_WEEK={AWARD_ARR_WEEK_TOP}
                            ></AwardContent>
                        </Tabs.Tab>
                        <Tabs.Tab
                            title={<div className="text__tab">月榜</div>}
                            key="2"
                        >
                            <AwardContent
                                AWARD_ARR_WEEK={AWARD_ARR_MONTH_TOP}
                            ></AwardContent>
                        </Tabs.Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

const LogContent = ({
    data,
    tabKey,
    hasMore,
    currentPage,
    loadMore,
    initialized,
}) => {
    const toFunction = useCallback((event) => {
        // let rid = event.currentTarget.dataset.rid;
        let uid = event.currentTarget.dataset.uid;
        if (uid) {
            appGate.openProfilePage(uid);
        }
    }, []);
    const toRoomFunction = useCallback((event) => {
        // let rid = event.currentTarget.dataset.rid;
        let uid = event.currentTarget.dataset.uid;
        if (uid) {
            appGate.openRoom(uid);
        }
    }, []);

    let liContent = null;
    if (!initialized) {
        liContent = null;
    } else if (data && data.length === 0) {
        liContent = <li className="li__nodata">暂无数据</li>;
    } else if (data && data.length > 0) {
        liContent = data.map((item, index) => {
            return (
                <li key={index}>
                    <div className="log_li_l">
                        <div className="log_li_time">
                            {formatTime(item.timestamp)}赠送
                        </div>
                        <div className="log_li_user">
                            <div
                                onClick={
                                    tabKey !== '3' ? toFunction : toRoomFunction
                                }
                                data-uid={item.uid}
                                className="log_li_l-g"
                            >
                                <img src={item.otherUserAvatar} alt="" />
                            </div>
                            <div className="log_li_l-alias">
                                {item.otherUserName}
                            </div>
                        </div>
                    </div>
                    <div className="log_li_r">
                        <div className="log_li_r-g">
                            <img src={item.giftIcon} alt="" />
                        </div>
                        <div className="log_li_r-gname">{`${item.giftName}*${item.quantity}`}</div>
                    </div>
                </li>
            );
        });
    }
    return (
        <Fragment>
            <div className="heart__log log_one-warp">
                <div className="rank__tab">
                    <div className="rank__tab-content">
                        <ul>{liContent}</ul>
                        {data.length > 0 && (hasMore || currentPage > 1) && (
                            <InfiniteScroll
                                loadMore={loadMore}
                                hasMore={hasMore}
                                threshold={0}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

const LogMain = ({ setShowLogs, ticket }) => {
    const PAGE_SIZE = 10;
    const buildPageState = () => ({
        items: [],
        page: 0,
        hasMore: true,
        loading: false,
        initialized: false,
    });

    const [tabKey, setTabKey] = useState('1');
    const [recordState, setRecordState] = useState({
        1: buildPageState(),
        2: buildPageState(),
    });

    const fetchRecordPage = useCallback(
        (recordType, page, append) => {
            setRecordState((prev) => ({
                ...prev,
                [recordType]: {
                    ...prev[recordType],
                    loading: true,
                },
            }));
            return instanceGame
                .get('/api/tour/records', {
                    params: {
                        activityId: 2,
                        page,
                        pageSize: PAGE_SIZE,
                        token: ticket,
                        recordType,
                    },
                })
                .then((d) => {
                    if (d.code !== '200') return;
                    const items = d?.content?.items || [];
                    setRecordState((prev) => {
                        const oldItems = append ? prev[recordType].items : [];
                        const nextItems = [...oldItems, ...items];
                        const total = Number(d?.content?.total || 0);
                        return {
                            ...prev,
                            [recordType]: {
                                ...prev[recordType],
                                items: nextItems,
                                page,
                                hasMore: nextItems.length < total,
                                loading: false,
                                initialized: true,
                            },
                        };
                    });
                })
                .catch(() => {
                    setRecordState((prev) => ({
                        ...prev,
                        [recordType]: {
                            ...prev[recordType],
                            loading: false,
                            initialized: true,
                        },
                    }));
                });
        },
        [ticket],
    );

    const setTabFn = useCallback(
        (key) => {
            setTabKey(key);
            const recordType = Number(key);
            setRecordState((prev) => ({
                ...prev,
                [recordType]: buildPageState(),
            }));
            fetchRecordPage(recordType, 1, false);
        },
        [fetchRecordPage],
    );

    useEffect(() => {
        fetchRecordPage(1, 1, false);
    }, [fetchRecordPage]);

    const currentRecordType = Number(tabKey);
    const currentState = recordState[currentRecordType] || buildPageState();
    const loadMore = useCallback(() => {
        if (currentState.loading || !currentState.hasMore) {
            return Promise.resolve();
        }
        return fetchRecordPage(currentRecordType, currentState.page + 1, true);
    }, [currentState, currentRecordType, fetchRecordPage]);

    return (
        <div className="heart__logs-warp">
            <div className="rank__nav">
                <div
                    className="rank__rank-icon"
                    onClick={() => {
                        setShowLogs(false);
                    }}
                ></div>
                <div className="rank_title"></div>
            </div>
            <div className="tem-tab-warp">
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
                            title={<div className="text__tab">赠送</div>}
                            key="1"
                        >
                            <LogContent
                                data={recordState[1].items}
                                tabKey={tabKey}
                                hasMore={recordState[1].hasMore}
                                currentPage={recordState[1].page}
                                loadMore={loadMore}
                                initialized={recordState[1].initialized}
                            ></LogContent>
                        </Tabs.Tab>
                        <Tabs.Tab
                            title={<div className="text__tab">收到</div>}
                            key="2"
                        >
                            <LogContent
                                data={recordState[2].items}
                                tabKey={tabKey}
                                hasMore={recordState[2].hasMore}
                                currentPage={recordState[2].page}
                                loadMore={loadMore}
                                initialized={recordState[2].initialized}
                            ></LogContent>
                        </Tabs.Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

const ShopAlert = ({
    setShwoDui,
    ticket,
    itemIdRef,
    infoShopArr,
    getCoinInfo,
    getShopInfo,
}) => {
    const [numValue, setNumValue] = useState(1);
    const closeAlert = useCallback(() => {
        setShwoDui(false);
    }, [setShwoDui]);
    const exchangeFn = useCallback(() => {
        instanceGame
            .post('/api/tour/shop/exchange', {
                activityId: 2,
                token: ticket,
                itemId: itemIdRef.current,
                quantity: numValue,
            })
            .then((d) => {
                if (d.code === '200') {
                    // setGoods(d.content);
                    if (d.content.success) {
                        Dialog.alert({
                            content: '兑换成功',
                            onConfirm: () => {
                                getCoinInfo();
                                getShopInfo();
                                setShwoDui(false);
                            },
                        });
                    }
                }
            });
    }, [ticket, setShwoDui, itemIdRef, getCoinInfo, getShopInfo, numValue]);

    let messageContent = infoShopArr.items
        .filter((i) => i.itemId === itemIdRef.current)
        .map((item, index) => {
            return (
                <li key={index}>
                    <div className="v_gift">
                        <img src={item.icon} alt="" />
                        <div className="v_gift-y">{item.costCoins}环游值</div>
                    </div>
                    <div className="v_gift-p">
                        <span>{item.validity}</span>
                        <span></span>
                    </div>
                    <div className="v_gift-name">{item.name}</div>
                </li>
            );
        });

    return (
        <Portal>
            <CenterOverlay className={'result-confirm '} onClose={closeAlert}>
                <div className={'result-alert-one'}>
                    <div className="v_ul">
                        <ul>{messageContent}</ul>
                    </div>
                    <div className="btn__alert-step">
                        <Stepper
                            style={{
                                '--border': '1px solid #f5f5f5',
                                '--border-inner': 'none',
                                '--height': '36px',
                                '--input-width': '70px',
                                '--input-background-color':
                                    'var(--adm-color-background)',
                                '--active-border': '1px solid #1677ff',
                            }}
                            defaultValue={numValue}
                            step={1}
                            min={1}
                            onChange={(value) => {
                                setNumValue(value);
                            }}
                        />
                    </div>
                    <div className="r_btns">
                        <div
                            className="rule_a_btn"
                            onClick={() => {
                                closeAlert();
                            }}
                        ></div>
                        <div
                            className="rule_b_btn"
                            onClick={() => {
                                exchangeFn();
                            }}
                        ></div>
                    </div>
                </div>
            </CenterOverlay>
        </Portal>
    );
};

const ShopMain = ({ setShowShop, ticket }) => {
    const [infoShop, setInfoShop] = useState('');
    const [coin, setCoin] = useState(0);
    const [showDui, setShwoDui] = useState(false);

    const itemIdRef = useRef(0);
    const getShopInfo = useCallback(() => {
        instanceGame
            .get('/api/tour/shop/items', {
                params: {
                    activityId: 2,
                    token: ticket,
                },
            })
            .then((d) => {
                setInfoShop(d.content);
            });
    }, [ticket]);
    const getCoinInfo = useCallback(() => {
        instanceGame
            .get('/api/tour/coins', {
                params: {
                    activityId: 2,
                    token: ticket,
                },
            })
            .then((d) => {
                setCoin(d.content.coins);
            });
    }, [ticket]);

    const exchangeFnAlert = useCallback((event) => {
        let itemId = Number(event.currentTarget.dataset.itemid);
        itemIdRef.current = itemId;
        setShwoDui(true);
    }, []);

    useEffect(() => {
        getShopInfo();
        getCoinInfo();
    }, [getShopInfo, getCoinInfo]);

    let mainContent = null;
    if (infoShop && infoShop.items.length === 0) {
        mainContent = <div className="shop_no">暂无商品</div>;
    } else if (infoShop && infoShop.items.length > 0) {
        mainContent = (
            <ul>
                {infoShop.items.map((item, index) => {
                    return (
                        <li key={index}>
                            <div className="shop_li_gift">
                                <img src={item.icon} alt="" />
                                <div className="shop_li_dat">
                                    {item.validity}
                                </div>
                            </div>
                            <div className="shop_li_name">{item.name}</div>
                            <div
                                onClick={exchangeFnAlert}
                                data-itemid={item.itemId}
                                className={
                                    'shop_li_btn' +
                                    (item.canExchange ? '' : ' noexchange')
                                }
                            >
                                {item.costCoins}环游币兑换
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }
    return (
        <div className="shopMain">
            <div className="rank__nav">
                <div
                    className="rank__rank-icon"
                    onClick={() => {
                        setShowShop(false);
                    }}
                ></div>
                <div className="rank_title"></div>
            </div>
            <div className="shop_tips">
                通过环游可获得环游币可在商店中兑换好礼
            </div>
            <div className="shop_my_bi">我的环游币：{coin}</div>
            <div className="shop_warp">{mainContent}</div>
            {showDui && (
                <ShopAlert
                    itemIdRef={itemIdRef}
                    setShwoDui={setShwoDui}
                    ticket={ticket}
                    infoShopArr={infoShop}
                    getCoinInfo={getCoinInfo}
                    getShopInfo={getShopInfo}
                ></ShopAlert>
            )}
        </div>
    );
};

const GiftContent = ({ giftArr }) => {
    return (
        <div className="gift_arr">
            <ul>
                {giftArr &&
                    giftArr.items.map((item, index) => {
                        return (
                            <li
                                key={index}
                                className={
                                    item.unlocked ? 'unlock_1' : 'lock_1'
                                }
                            >
                                {item.unlocked ? (
                                    <>
                                        <div className="g_pic">
                                            <img src={item.giftIcon} alt="" />
                                        </div>
                                        <div className="send_u">
                                            <img src="" alt="" />
                                        </div>
                                        <div className="g_num">
                                            X{item.bestSenderCount}
                                        </div>
                                    </>
                                ) : null}

                                <div className="g_name">{item.giftName}</div>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

const GiftList = ({ setShowGiftList, ticket, infoUser }) => {
    const [voiceUser, setVoiceUser] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUid, setCurrentUid] = useState(0);
    const [timeCurrent, setTimeCurrent] = useState(1);
    const [giftArr, setGiftArr] = useState('');

    const getGiftArr = useCallback(
        (userId) => {
            instanceGame
                .get('/api/tour/collection', {
                    params: {
                        token: ticket,
                        activityId: 2,
                        poolType: timeCurrent,
                        userId: currentUid,
                    },
                })
                .then((e) => {
                    if (e.code === '200') {
                        setGiftArr(e.content);
                    }
                });
        },
        [ticket, timeCurrent, currentUid],
    );
    const getUserVoice = useCallback(() => {
        instance
            .post('/api/v1/room/getRoomVoiceLists', {
                token: ticket,
                room_id: searchParam.ruid,
            })
            .then((e) => {
                if (e.code === '200') {
                    setVoiceUser(e.content);
                }
            });
    }, [ticket]);
    const voiceUserLiFn = useCallback(
        (event) => {
            let index = event.currentTarget.dataset.index;
            let uid = event.currentTarget.dataset.suid;
            if (uid === infoUser.uid) {
                Dialog.alert({
                    content: '不能选择自己哦！',
                    confirmText: '确定',
                    onConfirm: () => {},
                });
                return false;
            }

            setCurrentUser(Number(index));
            setCurrentUid(Number(uid));
        },
        [infoUser],
    );
    const tabNode = [
        {
            title: '',
            des: '',
            key: 1,
        },
        {
            title: '',
            des: '',
            key: 2,
        },
    ];

    const timeLineFn = useCallback(
        (event) => {
            let key = Number(event.currentTarget.dataset.key);
            setTimeCurrent(key);
        },
        [setTimeCurrent],
    );

    const backToFn = useCallback(() => {
        setCurrentUser(null);
        setCurrentUid(0);
    }, []);

    useEffect(() => {
        getUserVoice();
        getGiftArr();
    }, [getUserVoice, getGiftArr]);
    return (
        <div className="gitlist_main">
            <div className="rank__nav">
                <div
                    className="rank__rank-icon"
                    onClick={() => {
                        setShowGiftList(false);
                    }}
                ></div>
                <div className="rank_title"></div>
            </div>
            <div className="users-warp">
                <div className="users-warp-left"></div>
                <div className="users-warp-right">
                    <ul>
                        {voiceUser &&
                            voiceUser.map((item, index) => {
                                let seatContent = null;
                                if (item.seat === '99') {
                                    seatContent = (
                                        <div className="right-spic-icon-99">
                                            {item.seatFormat}
                                        </div>
                                    );
                                } else if (item.seat === '88') {
                                    seatContent = (
                                        <div className="right-spic-icon-88">
                                            {item.seatFormat}
                                        </div>
                                    );
                                } else {
                                    seatContent = (
                                        <div className="right-spic-icon">
                                            {item.seatFormat}
                                        </div>
                                    );
                                }
                                return (
                                    <li
                                        key={index}
                                        onClick={voiceUserLiFn}
                                        data-index={index}
                                        data-suid={item.uid}
                                        className={
                                            currentUser === index
                                                ? 'active'
                                                : ''
                                        }
                                    >
                                        <div className="users_right-spic">
                                            <img src={item.avatar} alt="" />
                                        </div>
                                        {seatContent}
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            </div>
            <ComTab
                timeLineFn={timeLineFn}
                tabNode={tabNode}
                current={timeCurrent}
                className={'turn__tab'}
            />
            <div className="gif_tips">
                {currentUid ? (
                    <div className="back_gt" onClick={backToFn}>
                        我的
                    </div>
                ) : null}
                <div className="gift_pro">
                    {currentUid ? voiceUser[currentUser]?.nickname : ['我的']}

                    <div>
                        打卡进度：
                        {giftArr &&
                            giftArr.unlockedCount +
                                '/' +
                                giftArr.totalCount}{' '}
                        已抵达
                    </div>
                </div>
            </div>
            <GiftContent ticket={ticket} giftArr={giftArr}></GiftContent>
        </div>
    );
};

const RankTemplate = ({ ticket }) => {
    const [showRule, setShowRule] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showRank, setShowRank] = useState(false);
    const [showAward, setShowAward] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [showShop, setShowShop] = useState(false);
    const [showGiftList, setShowGiftList] = useState(false);
    const [info, setInfo] = useState('');
    const [infoUser, setInfoUser] = useState('');
    const [voiceUser, setVoiceUser] = useState([]);
    const [stagesByTab, setStagesByTab] = useState({
        1: null,
        2: null,
    });
    // const [currentStage, setCurrentStage] = useState(null); // li 索引

    const [currentUser, setCurrentUser] = useState(null);

    const [sendRelult, setSendRelult] = useState('');

    const [timeCurrent, setTimeCurrent] = useState(1);
    const [animStateByTab, setAnimStateByTab] = useState({
        1: {
            isRingFlashing: false,
            oneDZooming: false,
            giftAnimUrl: '',
            showGiftAnim: false,
            giftAnimKey: 0,
            isTourAnimating: false,
        },
        2: {
            isRingFlashing: false,
            oneDZooming: false,
            giftAnimUrl: '',
            showGiftAnim: false,
            giftAnimKey: 0,
            isTourAnimating: false,
        },
    });
    const sendLockRef = useRef({ 1: false, 2: false });
    const lastSendCountRef = useRef({ 1: 1, 2: 1 });
    const currentTabKey = String(timeCurrent);
    const currentStages = stagesByTab[currentTabKey];
    const currentAnimState = animStateByTab[currentTabKey] || {};
    const getUserInfo = useCallback(() => {
        instance
            .post('/api/v1/user/getUserInfo', {
                token: ticket,
            })
            .then((e) => {
                if (e.code === '200') {
                    setInfoUser(e.content);
                }
            });
    }, [ticket]);
    const getUserVoice = useCallback(() => {
        instance
            .post('/api/v1/room/getRoomVoiceLists', {
                token: ticket,
                room_id: searchParam.ruid,
            })
            .then((e) => {
                if (e.code === '200') {
                    setVoiceUser(e.content);
                }
            });
    }, [ticket]);

    const getPoolFn = useCallback(() => {
        instanceGame
            .get('/api/tour/info', {
                params: {
                    activityId: 2,
                    rid: searchParam.ruid,
                    token: ticket,
                },
            })
            .then((d) => {
                setInfo(d.content);
                setStagesByTab({
                    1: d.content.pools?.[0] || null,
                    2: d.content.pools?.[1] || null,
                });
            });
    }, [ticket]);

    const ruleFn = useCallback((key) => {
        setShowRule(true);
    }, []);
    const rankFn = useCallback((key) => {
        setShowRank(true);
    }, []);

    // const stagesLiFn = useCallback((event) => {
    //     let index = event.currentTarget.dataset.index;

    //     setCurrentStage(Number(index));
    // }, []);

    const tabNode = [
        {
            title: '',
            des: '',
            key: 1,
        },
        {
            title: '',
            des: '',
            key: 2,
        },
    ];

    const timeLineFn = useCallback(
        (event) => {
            let key = Number(event.currentTarget.dataset.key);
            setTimeCurrent(key);
        },
        [setTimeCurrent],
    );

    const voiceUserLiFn = useCallback(
        (event) => {
            let index = event.currentTarget.dataset.index;
            let uid = event.currentTarget.dataset.suid;
            if (uid === infoUser.uid) {
                Dialog.alert({
                    content: '不能选择自己哦！',
                    confirmText: '确定',
                    onConfirm: () => {},
                });
                return false;
            }
            setCurrentUser(Number(index));
        },
        [infoUser],
    );

    const sendFn = useCallback(
        (eventOrCount) => {
            const tabKey = String(timeCurrent);
            const tabStages = stagesByTab[tabKey];
            const tabAnimState = animStateByTab[tabKey] || {};
            let count = lastSendCountRef.current[tabKey] || 1;
            if (
                eventOrCount &&
                eventOrCount.currentTarget &&
                eventOrCount.currentTarget.dataset
            ) {
                const nextCount = Number(
                    eventOrCount.currentTarget.dataset.count || 1,
                );
                count = Number.isNaN(nextCount) ? 1 : nextCount;
            } else if (
                typeof eventOrCount === 'number' ||
                typeof eventOrCount === 'string'
            ) {
                const nextCount = Number(eventOrCount);
                count = Number.isNaN(nextCount) ? count : nextCount;
            }
            if (!count || count < 1) {
                count = 1;
            }
            if (tabAnimState.isTourAnimating || sendLockRef.current[tabKey]) {
                return false;
            }
            if (currentUser === null) {
                Dialog.alert({
                    content: '请选择接收的嘉宾！',
                    confirmText: '确定',
                    onConfirm: () => {},
                });
                return false;
            }
            lastSendCountRef.current[tabKey] = count;
            sendLockRef.current[tabKey] = true;
            instanceGame
                .post('/api/tour/play', {
                    activityId: 2,
                    receiverId: Number(voiceUser[currentUser].uid),
                    // senderId: Number(infoUser.uid),
                    token: ticket,
                    poolType: timeCurrent,
                    count,
                })
                .then((d) => {
                    if (d.code === '200') {
                        (async () => {
                            setAnimStateByTab((prev) => ({
                                ...prev,
                                [tabKey]: {
                                    ...prev[tabKey],
                                    isTourAnimating: true,
                                },
                            }));
                            try {
                                // 1) 8个礼物按环形顺序闪一圈
                                const ringGiftCount =
                                    tabStages?.gifts?.length || 0;
                                const ringFlashMs = Math.max(
                                    900,
                                    (ringGiftCount - 1) * 100 + 220,
                                );
                                setAnimStateByTab((prev) => ({
                                    ...prev,
                                    [tabKey]: {
                                        ...prev[tabKey],
                                        isRingFlashing: true,
                                    },
                                }));
                                await sleep(ringFlashMs);
                                setAnimStateByTab((prev) => ({
                                    ...prev,
                                    [tabKey]: {
                                        ...prev[tabKey],
                                        isRingFlashing: false,
                                    },
                                }));

                                // 2) 中间 one_d 做一次放大缩小
                                setAnimStateByTab((prev) => ({
                                    ...prev,
                                    [tabKey]: {
                                        ...prev[tabKey],
                                        oneDZooming: true,
                                    },
                                }));
                                await sleep(500);
                                setAnimStateByTab((prev) => ({
                                    ...prev,
                                    [tabKey]: {
                                        ...prev[tabKey],
                                        oneDZooming: false,
                                    },
                                }));
                            } finally {
                                sendLockRef.current[tabKey] = false;
                                setAnimStateByTab((prev) => ({
                                    ...prev,
                                    [tabKey]: {
                                        ...prev[tabKey],
                                        isTourAnimating: false,
                                    },
                                }));
                                setSendRelult(d.content);
                                setShowResult(true);
                            }
                        })();
                    } else {
                        sendLockRef.current[tabKey] = false;
                    }
                })
                .catch(() => {
                    sendLockRef.current[tabKey] = false;
                });
        },
        [
            animStateByTab,
            ticket,
            currentUser,
            voiceUser,
            stagesByTab,
            timeCurrent,
        ],
    );

    let btnContent = (
        <>
            <div className="btns_1" onClick={sendFn} data-count="1">
                <div className="btns_coin">
                    <span>
                        {stagesByTab[timeCurrent] &&
                            1 * stagesByTab[timeCurrent].costPerTour}
                    </span>
                    <span></span>
                </div>
            </div>
            <div className="btns_2" onClick={sendFn} data-count={'10'}>
                <div className="btns_coin">
                    <span>
                        {stagesByTab[timeCurrent] &&
                            10 * stagesByTab[timeCurrent].costPerTour}
                    </span>
                    <span></span>
                </div>
            </div>
        </>
    );

    useEffect(() => {
        setTitle('浪漫环游');
        getUserInfo();
        getUserVoice();
        getPoolFn();
    }, [getUserInfo, getUserVoice, getPoolFn]);

    let mainContent = null;
    if (!info && !infoUser) {
        mainContent = <BlockLoading />;
    } else if (info && infoUser) {
        mainContent = (
            <Fragment>
                {!showRank && (
                    <Fragment>
                        <div className="heart__warp-banner">
                            <div className="rule__icon" onClick={ruleFn}>
                                说明
                            </div>
                            <div
                                className="log__icon"
                                onClick={() => {
                                    setShowLogs(true);
                                }}
                            >
                                记录
                            </div>
                            <div className="rank__icon" onClick={rankFn}>
                                <span></span>
                                <span>榜单</span>
                            </div>
                            <div
                                className="tuan__icon"
                                onClick={() => {
                                    setShowGiftList(true);
                                }}
                            >
                                <span></span>
                                <span>图鉴</span>
                            </div>
                            <div
                                className="shop__icon"
                                onClick={() => {
                                    setShowShop(true);
                                }}
                            >
                                <span></span>
                                <span>商店</span>
                            </div>
                            <div className="money__icon">
                                <span></span>
                                <span>{infoUser.coin}</span>
                            </div>
                            <div className="ra_tips">
                                开始邂逅你的环球浪漫之旅
                            </div>
                            <div className="users-warp">
                                <div className="users-warp-left"></div>
                                <div className="users-warp-right">
                                    <ul>
                                        {voiceUser &&
                                            voiceUser.map((item, index) => {
                                                let seatContent = null;
                                                if (item.seat === '99') {
                                                    seatContent = (
                                                        <div className="right-spic-icon-99">
                                                            {item.seatFormat}
                                                        </div>
                                                    );
                                                } else if (item.seat === '88') {
                                                    seatContent = (
                                                        <div className="right-spic-icon-88">
                                                            {item.seatFormat}
                                                        </div>
                                                    );
                                                } else {
                                                    seatContent = (
                                                        <div className="right-spic-icon">
                                                            {item.seatFormat}
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <li
                                                        key={index}
                                                        onClick={voiceUserLiFn}
                                                        data-index={index}
                                                        data-suid={item.uid}
                                                        className={
                                                            currentUser ===
                                                            index
                                                                ? 'active'
                                                                : ''
                                                        }
                                                    >
                                                        <div className="users_right-spic">
                                                            <img
                                                                src={
                                                                    item.avatar
                                                                }
                                                                alt=""
                                                            />
                                                        </div>
                                                        {seatContent}
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </div>
                            </div>
                            <ComTab
                                timeLineFn={timeLineFn}
                                tabNode={tabNode}
                                current={timeCurrent}
                                className={'turn__tab'}
                            />
                            <div className={'heart__main show'}>
                                <div className="gift_ul">
                                    <ul
                                        className={`${currentAnimState.isRingFlashing ? 'anim-ring ' : ''}${timeCurrent === 2 ? 'tab-two-circle' : ''}`.trim()}
                                    >
                                        {currentStages &&
                                            currentStages?.gifts.map(
                                                (item, index) => {
                                                    const giftCount =
                                                        currentStages?.gifts
                                                            ?.length || 0;
                                                    const startIndex = 0;

                                                    const flashDelayIndex =
                                                        giftCount > 0
                                                            ? (index -
                                                                  startIndex +
                                                                  giftCount) %
                                                              giftCount
                                                            : 0;
                                                    return (
                                                        <li
                                                            key={index}
                                                            data-index={index}
                                                            // onClick={stagesLiFn}
                                                            style={
                                                                currentAnimState.isRingFlashing
                                                                    ? {
                                                                          animationDelay: `${flashDelayIndex * 0.1}s`,
                                                                      }
                                                                    : undefined
                                                            }
                                                        >
                                                            <div className="gift_ul-icon">
                                                                <img
                                                                    src={
                                                                        item.icon
                                                                    }
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="gift_ul-bi">
                                                                <div></div>
                                                                <div>
                                                                    {
                                                                        item.tourCoins
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="gift_ul-val">
                                                                {item.tourValue}
                                                                <span>
                                                                    环游值
                                                                </span>
                                                            </div>
                                                        </li>
                                                    );
                                                },
                                            )}
                                    </ul>
                                </div>
                                <div
                                    className={
                                        'one_d' +
                                        (currentAnimState.oneDZooming
                                            ? ' anim-zoom'
                                            : '')
                                    }
                                ></div>
                                <div className="btns_warp">{btnContent}</div>
                            </div>
                        </div>
                    </Fragment>
                )}

                {showRank && (
                    <RankMain
                        ticket={ticket}
                        setShowRank={setShowRank}
                        setShowAward={setShowAward}
                    ></RankMain>
                )}
                {showAward && (
                    <RankAward
                        ticket={ticket}
                        setShowAward={setShowAward}
                    ></RankAward>
                )}
                {showLogs && (
                    <LogMain
                        ticket={ticket}
                        setShowLogs={setShowLogs}
                    ></LogMain>
                )}
                {showShop && (
                    <ShopMain
                        ticket={ticket}
                        setShowShop={setShowShop}
                    ></ShopMain>
                )}
                {showGiftList && (
                    <GiftList
                        ticket={ticket}
                        setShowGiftList={setShowGiftList}
                        infoUser={infoUser}
                    ></GiftList>
                )}
            </Fragment>
        );
    }

    return (
        <div
            className={
                `heart__warp_${timeCurrent} heart_main` +
                (searchParam.room === 'full' ? ' week__full' : '')
            }
        >
            {mainContent}
            {showRule && (
                <RuleAlert
                    setShow={setShowRule}
                    stagesByTab={stagesByTab}
                ></RuleAlert>
            )}
            {showResult && (
                <Resultalert
                    infoUser={infoUser}
                    currentUser={currentUser}
                    voiceUser={voiceUser}
                    sendRelult={sendRelult}
                    setShow={setShowResult}
                    sendFn={sendFn}
                    linkWithTourAnim
                ></Resultalert>
            )}
        </div>
    );
};

var WeekStar = function ({ ticket }) {
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
