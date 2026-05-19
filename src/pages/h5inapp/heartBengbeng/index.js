import './index.scss';

import React, {
    useState,
    useCallback,
    useEffect,
    Fragment,
    useRef,
} from 'react';

import { connect } from 'react-redux';
import { Tabs, InfiniteScroll } from 'antd-mobile';

import CenterOverlay from '@/component/CenterOverlay';
import Portal from '@/component/Protal';
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
const parseAmount = (value) => {
    const num = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
    return Number.isFinite(num) ? num : 0;
};

const RuleAlert = ({ setShow, tabKeyv, timeCurrent, status }) => {
    const closeAlert = useCallback(() => {
        setShow(false);
    }, [setShow]);

    return (
        <Portal>
            <CenterOverlay className="weekstar-alert" onClose={closeAlert}>
                <div className="title-icon"></div>
                <div className="rule__div">
                    一、活动玩法
                    <br />
                    1.
                    进入活动选择麦上嘉宾，赠送对应礼物有概率解锁心动场景，当赠礼数量达到场景的保底次数，必解锁下一场景。
                    <br />
                    2. 场景概率如下：
                    <br />
                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th width="15%">场景</th>
                                    <th>场景礼物</th>
                                    <th>解锁下一场景礼物</th>
                                    <th width="15%">保底次数</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>初遇</td>
                                    <td>恋恋相遇（99金币）</td>
                                    <td>同频心跳（60%）</td>
                                    <td>5</td>
                                </tr>
                                <tr>
                                    <td>同频</td>
                                    <td>同频心跳（990金币）</td>
                                    <td>爱恋升温（40%）</td>
                                    <td>8</td>
                                </tr>
                                <tr>
                                    <td>升温</td>
                                    <td>爱恋升温（2990金币）</td>
                                    <td>怦然心动（20%）</td>
                                    <td>10</td>
                                </tr>
                                <tr>
                                    <td>心动</td>
                                    <td>怦然心动（5200金币）</td>
                                    <td>爱的誓约（10%）</td>
                                    <td>20</td>
                                </tr>
                                <tr>
                                    <td>承诺</td>
                                    <td>爱的誓约（8880金币）</td>
                                    <td>命定双生（5%）</td>
                                    <td>30</td>
                                </tr>
                                <tr>
                                    <td>永恒</td>
                                    <td colSpan={3}>命定双生（13140金币）</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    3.
                    当成功解锁新场景时，即触发CP全站广播，并荣登心动头条-此刻心动。
                    <br />
                    4.
                    每次赠送永恒场景-【命定双生】礼物时，将被记录在心动头条-永恒见证。
                    <br />
                    二、活动规范
                    <br />
                    1. 未成年人均不得参与本活动的任何付费环节。
                    <br />
                    2.
                    为维护公平健康的语音交友环境，保障全体用户的合法权益，本平台严禁任何形式的“礼物私下返现”或“礼物回收”行为；一经发现，即视为严重违规，违规者将面临永久封号及法律追责。
                    <br />
                    3. 活动参与过程中有任何疑问可咨询站内客服。
                    <br />
                    4. 本活动规则的最终解释权归【椰壳app】所有。
                </div>
                <div className="rule_a_btn" onClick={closeAlert}>
                    确定
                </div>
            </CenterOverlay>
        </Portal>
    );
};

const Resultalert = ({
    setShow,
    infoUser,
    currentUser,
    voiceUser,
    stages,
    currentStage,
    sendRelult,
    sendFn,
    setShowRank,
    getProgressFn,
    currentStatus,
    currentStageOrigin,
    setTabFn,
    lastSendStage,
}) => {
    const closeAlert = useCallback(
        (source = 'normal', withProgress = true) => {
            setShow(false);
            if (withProgress) {
                getProgressFn(undefined, source);
            }
        },
        [setShow, getProgressFn],
    );

    const giftName = stages.find((i) => i.stage === currentStage + 1) || {};
    const giftNameOrigin =
        stages.find((i) => i.stage === currentStageOrigin + 1) || giftName;
    const sentGift =
        stages.find((i) => i.stage === Number(lastSendStage)) ||
        giftNameOrigin ||
        giftName;
    // const nextStage = stages.find((i) => i.stage === sendRelult.newStage);
    const nextStageJie = stages.find(
        (i) => i.stage === sendRelult.newStage - 1,
    );
    const maxStage = Number(sendRelult?.maxStage || 6);
    const isFinalSendStage =
        sendRelult?.isFinalStage === true || Number(lastSendStage) >= maxStage;
    const hideFinalTopMsg =
        isFinalSendStage &&
        Number(lastSendStage) < maxStage &&
        sendRelult?.unlocked === false;
    console.log(currentStage, '---', currentStatus);

    let messageContent = null;
    let btnContent = null;

    if (sendRelult.unlocked === false) {
        //到达当前阶段返回的是false
        if (isFinalSendStage) {
            if (sendRelult.firstSend) {
                messageContent = `成功登上【永恒见证】头条！珍藏此刻！`;
                btnContent = (
                    <div className="r_btns">
                        <div className="rule_a_btn" onClick={closeAlert}>
                            取消
                        </div>
                        <div
                            className="rule_b_btn"
                            onClick={() => {
                                closeAlert();
                                setTabFn('2');

                                setShowRank(true);
                            }}
                        >
                            去看看
                        </div>
                    </div>
                );
            } else {
                messageContent = hideFinalTopMsg
                    ? null
                    : `恭喜你们成功登顶！赠送永恒礼物，即可登上【永恒见证】头条，全服可见！`;
                btnContent = hideFinalTopMsg ? (
                    <div className="r_btns">
                        <div className="rule_a_btn" onClick={closeAlert}>
                            取消
                        </div>
                        <div
                            className="rule_b_btn"
                            onClick={() => {
                                sendFn('continue');
                                closeAlert('continue', false);
                            }}
                        >
                            <div className="rule_b_btn-div2">继续赠送</div>
                            <div className="rule_b_btn-div1">
                                <span></span>
                                <span>{giftName.giftValue}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="r_btns">
                        <div className="rule_a_btn" onClick={closeAlert}>
                            取消
                        </div>
                        <div
                            className="rule_b_btn"
                            onClick={() => {
                                sendFn('continue', 6);
                                closeAlert('continue', false);
                            }}
                        >
                            <div className="rule_b_btn-div2">赠送</div>
                            <div className="rule_b_btn-div1">
                                <span></span>
                                <span>{nextStageJie.giftValue}</span>
                            </div>
                        </div>
                    </div>
                );
            }
        } else if (currentStageOrigin === -1) {
            messageContent = `信号越来越强烈，再赠送 ${sendRelult.pityRemaining} 次，必解锁下一场景！`;
            btnContent = (
                <div className="r_btns">
                    <div className="rule_a_btn" onClick={closeAlert}>
                        取消
                    </div>
                    <div
                        className="rule_b_btn"
                        onClick={() => {
                            sendFn('continue');
                            closeAlert('continue', false);
                        }}
                    >
                        <div className="rule_b_btn-div2">继续赠送</div>
                        <div className="rule_b_btn-div1">
                            <span></span>
                            <span>{giftName.giftValue}</span>
                        </div>
                    </div>
                </div>
            );
        } else {
            messageContent = null;

            btnContent = (
                <div className="r_btns">
                    <div className="rule_a_btn" onClick={closeAlert}>
                        取消
                    </div>
                    <div
                        className="rule_b_btn"
                        onClick={() => {
                            sendFn('continue');
                            closeAlert('continue', false);
                        }}
                    >
                        <div className="rule_b_btn-div2">继续赠送</div>
                        <div className="rule_b_btn-div1">
                            <span></span>
                            <span>{giftNameOrigin.giftValue * 1}</span>
                        </div>
                    </div>
                </div>
            );
        }
    } else if (sendRelult.unlocked === true) {
        if (isFinalSendStage) {
            if (sendRelult.firstSend) {
                messageContent = `成功登上【永恒见证】头条！珍藏此刻！`;
                btnContent = (
                    <div className="r_btns">
                        <div className="rule_a_btn" onClick={closeAlert}>
                            取消
                        </div>
                        <div
                            className="rule_b_btn"
                            onClick={() => {
                                closeAlert();
                                setShowRank(true);
                                setTabFn('2');
                            }}
                        >
                            去看看
                        </div>
                    </div>
                );
            } else {
                messageContent = hideFinalTopMsg
                    ? null
                    : `恭喜你们成功登顶！赠送永恒礼物，即可登上【永恒见证】头条，全服可见！`;
                btnContent = hideFinalTopMsg ? (
                    <div className="r_btns">
                        <div className="rule_a_btn" onClick={closeAlert}>
                            取消
                        </div>
                        <div
                            className="rule_b_btn"
                            onClick={() => {
                                sendFn('continue', 6);
                                closeAlert('continue', false);
                            }}
                        >
                            <div className="rule_b_btn-div2">继续赠送</div>
                            <div className="rule_b_btn-div1">
                                <span></span>
                                <span>{giftName.giftValue}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="r_btns">
                        <div className="rule_a_btn" onClick={closeAlert}>
                            取消
                        </div>
                        <div
                            className="rule_b_btn"
                            onClick={() => {
                                sendFn('continue', 6);
                                closeAlert('continue', false);
                            }}
                        >
                            <div className="rule_b_btn-div2">赠送</div>
                            <div className="rule_b_btn-div1">
                                <span></span>
                                <span>{nextStageJie.giftValue}</span>
                            </div>
                        </div>
                    </div>
                );
            }
        } else {
            messageContent = `成功抵达【${nextStageJie.name}】触发心动头条！`;
            btnContent = (
                <div className="r_btns">
                    <div className="rule_a_btn" onClick={closeAlert}>
                        取消
                    </div>
                    {currentStage === 0 ? (
                        <div
                            className="rule_b_btn"
                            onClick={() => {
                                closeAlert();
                            }}
                        >
                            确定
                        </div>
                    ) : (
                        <div
                            className="rule_b_btn"
                            onClick={() => {
                                closeAlert();
                                setShowRank(true);
                                setTabFn('1');
                            }}
                        >
                            去看看
                        </div>
                    )}
                </div>
            );
        }
    }

    const btnTips = (
        <div className="r_text1">
            您已向 [{voiceUser[currentUser].nickname}] 成功送出 [
            {sentGift.giftName || '--'}]
        </div>
    );

    return (
        <Portal>
            <CenterOverlay className="result-alert" onClose={closeAlert}>
                <div className="result_user">
                    <div className="result_user_user-1">
                        <img src={infoUser && infoUser.head_img} alt="" />
                    </div>
                    <div className="result_user_user-2">
                        <img src={voiceUser[currentUser].avatar} alt="" />
                    </div>
                    <div className="r_heart_icon"></div>
                </div>
                {btnTips}

                <div className="r_text2">
                    <div className="r_gift_icon">
                        <img src={sentGift.giftIcon} alt="" />
                    </div>
                    {messageContent}
                    {/* 恭喜你们成功登顶！赠送永恒礼物，即可登上【永恒见证】头条，全服可见！ */}
                </div>
                {btnContent}
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
                    <div className="rank_one-info">
                        <div
                            className="one_info-1"
                            onClick={
                                item.senderInRoom ? toRoomFunction : toFunction
                            }
                            data-uid={item.senderRoomOwnerUid}
                        >
                            <img src={item.senderAvatar} alt="" />
                        </div>
                        <div
                            className="one_info-2"
                            onClick={
                                item.receiverInRoom
                                    ? toRoomFunction
                                    : toFunction
                            }
                            data-uid={item.receiverRoomOwnerUid}
                        >
                            <img src={item.receiverAvatar} alt="" />
                        </div>
                        <div className="one_info-heart"></div>
                    </div>
                    <div className="rank_one-text">{item.message}</div>
                </li>
            );
        });
    }
    return (
        <Fragment>
            <div className="heart__rank rank_one-warp">
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
const RankThreeContent = ({
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
                    <div className="li_three-time">
                        <div>
                            {formatTime(item.lastUnlockTime * 1000, 'y-m-d')}
                        </div>
                        <div>已完成阶段 ({item.currentStage}/6）</div>
                    </div>
                    <div className="li_three-div">
                        <div className="rank_one-info">
                            <div
                                className="one_info-1"
                                onClick={
                                    item.senderInRoom
                                        ? toRoomFunction
                                        : toFunction
                                }
                                data-uid={item.senderRoomOwnerUid}
                            >
                                <img src={item.senderAvatar} alt="" />
                            </div>
                            <div
                                className="one_info-2"
                                onClick={
                                    item.receiverInRoom
                                        ? toRoomFunction
                                        : toFunction
                                }
                                data-uid={item.receiverRoomOwnerUid}
                            >
                                <img src={item.receiverAvatar} alt="" />
                            </div>
                            <div className="one_info-heart"></div>
                        </div>
                        <div className="rank_one-text">
                            <div>
                                [{item.senderName}]<span>与</span>[
                                {item.receiverName}]
                            </div>
                            <div>最近解锁：{item.stageName}</div>
                        </div>
                    </div>
                </li>
            );
        });
    }
    return (
        <Fragment>
            <div className="heart__rank rank_three-warp">
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

const RankTwoContent = ({
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
                    <div className="rank_one-info">
                        <div
                            className="one_info-1"
                            onClick={
                                item.senderInRoom ? toRoomFunction : toFunction
                            }
                            data-uid={item.senderRoomOwnerUid}
                        >
                            <img src={item.senderAvatar} alt="" />
                        </div>
                        <div
                            className="one_info-2"
                            onClick={
                                item.receiverInRoom
                                    ? toRoomFunction
                                    : toFunction
                            }
                            data-uid={item.receiverRoomOwnerUid}
                        >
                            <img src={item.receiverAvatar} alt="" />
                        </div>
                        <div className="one_info-heart"></div>
                    </div>
                    <div className="rank_one-alias">
                        <div>{item.senderName}</div>
                        <div>{item.receiverName}</div>
                    </div>
                    <div className="rank_one-text">{item.message}</div>
                </li>
            );
        });
    }
    return (
        <Fragment>
            <div className="heart__rank rank_two-warp">
                <div className="rank__tab">
                    <div className="rank__tab-content">
                        <div className="rank_two-tips">
                            你的每一次“命定双生”，都是对TA的再次承诺
                            每次赠礼都会被见证，置顶展示
                        </div>
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

const StageName = {
    1: '初遇',
    2: '同频',
    3: '升温',
    4: '心动',
    5: '承诺',
    6: '永恒',
};
const RankTemplate = ({ ticket }) => {
    const PAGE_SIZE = 10;
    const buildPageState = () => ({
        items: [],
        page: 0,
        hasMore: true,
        loading: false,
        initialized: false,
    });

    const [showRule, setShowRule] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showRank, setShowRank] = useState(false);
    const [tabKey, setTabKey] = useState('1');

    const [info, setInfo] = useState('');
    const [infoUser, setInfoUser] = useState('');
    const [voiceUser, setVoiceUser] = useState([]);
    const [stages, setStages] = useState([]);
    const [currentStage, setCurrentStage] = useState(0); // li 索引
    const [currentStageOrigin, setCurrentStageOrigin] = useState(-1); // li 索引
    const [currentUser, setCurrentUser] = useState(null);
    const [rankingState, setRankingState] = useState({
        1: buildPageState(),
        2: buildPageState(),
        3: buildPageState(),
    });

    const [currentStatus, setCurrentStatus] = useState(0);
    const [currentText, setCurrentText] = useState(0);
    const [sendRelult, setSendRelult] = useState('');
    const [lastSendStage, setLastSendStage] = useState(1);
    const [probability, setProbability] = useState('');
    const [btnLast, setBtnLast] = useState(false);
    const stageRef = useRef(0);
    const originRef = useRef(-1);

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
                // e.content = [
                //     {
                //         rid: '10',
                //         uid: '49',
                //         avatar: 'https://s3.njxianyuwl.cn/dev/2026-03-31/21-103/1774965247873222536.png',
                //         nickname: '曾经的鞋子',
                //         sex: '1',
                //         volume: '2',
                //         seat: '99',
                //         seatFormat: '老板',
                //         rank: '0',
                //         avatarFrame: '',
                //         sound_wave_id: '',
                //         wheat_msg: '',
                //         wheat_img:
                //             'https://s3.njxianyuwl.cn/dev/2023-11-29/17-103ht1701249711772920315.png',
                //     },
                // ];
                if (e.code === '200') {
                    setVoiceUser(e.content);
                }
            });
    }, [ticket]);

    const getRank = useCallback(() => {
        instanceGame
            .get('/api/activity/info', {
                params: {
                    activityId: 1,
                    rid: searchParam.ruid,
                    token: ticket,
                },
            })
            .then((d) => {
                d.content.stages.forEach((i, d) => {
                    if (d === 0) {
                        i.status = 2;
                    } else if (d === 1) {
                        i.status = 1;
                    } else {
                        i.status = 0;
                    }
                });
                setInfo(d.content);
                setStages(d.content.stages);
                setCurrentStage(-1);
            });
    }, [ticket]);

    const fetchRankingPage = useCallback(
        (rankingType, page, append) => {
            const endpointMap = {
                1: '/api/activity/headlines/moment',
                2: '/api/activity/headlines/eternal',
                3: '/api/activity/headlines/diary',
            };
            const endpoint = endpointMap[rankingType];
            if (!endpoint) {
                return Promise.resolve();
            }

            setRankingState((prev) => ({
                ...prev,
                [rankingType]: {
                    ...prev[rankingType],
                    loading: true,
                },
            }));

            return instanceGame
                .get(endpoint, {
                    params: {
                        activityId: 1,
                        page,
                        pageSize: PAGE_SIZE,
                        token: ticket,
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

    const setTabFn = useCallback((key) => {
        setTabKey(key);
    }, []);
    const ruleFn = useCallback((key) => {
        setShowRule(true);
    }, []);
    const rankFn = useCallback((key) => {
        setShowRank(true);
    }, []);

    const stagesLiFn = useCallback(
        (event) => {
            let index = event.currentTarget.dataset.index;
            let status = event.currentTarget.dataset.status;
            if (status !== '2') {
                // 未解锁时回退到当前可赠送阶段，避免污染后续“赠送”参数
                stageRef.current = Math.max(1, currentStatus - 1);
                setCurrentStage(Math.max(-1, currentStatus - 2));
                setCurrentStageOrigin(-1);
                Dialog.alert({
                    content: '请按场景顺序解锁哦！',
                    confirmText: '确定',
                    onConfirm: () => {},
                });
                return false;
            }

            stageRef.current = info.stages[index].stage;
            setCurrentStage(Number(index));
            setCurrentStageOrigin(Number(index));
            originRef.current = Number(index);
        },
        [info, currentStatus],
    );

    const getProgressFn = useCallback(
        async (uid, source = 'normal') => {
            instanceGame
                .get('/api/activity/progress', {
                    params: {
                        activityId: 1,
                        guestId: uid || voiceUser[currentUser].uid,
                        token: ticket,
                    },
                })
                .then((d) => {
                    // d.content.currentStage = 6;
                    // d.content.pityLimit = 8;
                    // d.content.pityCounter = 7;
                    // d.content.currentStage =
                    //     d.content.currentStage > 6 ? 6 : d.content.currentStage;
                    // console.log(d.content.currentStage);
                    if (d.code === '200') {
                        setInfo(d.content);
                        setStages(d.content.stages);
                        setCurrentStatus(d.content.currentStage);
                        setCurrentText(d.content.currentStage);
                        setCurrentStage(d.content.currentStage - 2);
                        stageRef.current = Math.max(
                            1,
                            d.content.currentStage - 1,
                        );
                        // setCurrentStageOrigin(-1);

                        if (source === 'continue') {
                            setCurrentStageOrigin(originRef.current);
                            //弹窗出现  继续赠送按钮
                        } else {
                            setCurrentStageOrigin(-1);
                        }
                        // } else {
                        //     if (stageRef.current > 0) {
                        //         //如果点击了已经解锁的
                        //         setCurrentStageOrigin(stageRef.current);
                        //         stageRef.current = 0;
                        //     } else {
                        //         setCurrentStageOrigin(-1);
                        //     }
                        // }

                        setProbability(d.content.unlockProbability);
                        if (d.content.pityLimit - d.content.pityCounter === 1) {
                            //最后一次解锁
                            setBtnLast(true);
                        } else {
                            setBtnLast(false);
                        }
                    }
                });
        },
        [ticket, currentUser, voiceUser],
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
            getProgressFn(uid);
        },
        [getProgressFn, infoUser],
    );

    const sendFn = useCallback(
        (eventOrSource, forcedStage) => {
            const event =
                typeof eventOrSource === 'string' ? null : eventOrSource;
            let quantity = event?.currentTarget?.dataset.quantity || 1;
            const stageToSend = Number(
                typeof forcedStage === 'number'
                    ? forcedStage
                    : stageRef.current,
            );
            const safeStageToSend = Math.max(1, stageToSend);
            const sendQuantity = Number(quantity) || 1;

            if (currentUser === null) {
                Dialog.alert({
                    content: '请选择接收感应的CP！',
                    confirmText: '确定',
                    onConfirm: () => {},
                });
                return false;
            }

            const stageConfig = stages.find(
                (i) => Number(i.stage) === safeStageToSend,
            );
            const giftValue = parseAmount(stageConfig?.giftValue);
            const currentBalance = parseAmount(infoUser?.coin);
            const totalCost = giftValue * sendQuantity;
            if (totalCost > 0 && currentBalance < totalCost) {
                Dialog.alert({
                    content: `余额不足，当前需${totalCost}，余额${currentBalance}`,
                    confirmText: '确定',
                    onConfirm: () => {},
                });
                return false;
            }

            instanceGame
                .post('/api/activity/gift/send', {
                    activityId: 1,
                    receiverId: Number(voiceUser[currentUser].uid),
                    senderId: Number(infoUser.uid),
                    //  如果点击的是当前解锁的 用currentStage，如果点击已经解锁过的用currentStageOrigin
                    // stage:
                    //     currentStage === currentStageOrigin + 1 ||
                    //     currentStageOrigin === -1
                    //         ? currentStage + 1
                    //         : currentStageOrigin + 1,
                    stage: safeStageToSend,
                    quantity: sendQuantity,
                    token: ticket,
                    roomOwnerUid: Number(searchParam.ruid),
                })
                .then((d) => {
                    //currentStage：送礼后当前阶段
                    // maxStage：最大阶段（当前是 6）
                    // isFinalStage：是否已到最终阶段
                    // firstSend：该送礼方对该收礼方在本活动是否首次送出
                    // d.content = {
                    //     unlocked: false,
                    //     newStage: 2,
                    //     pityRemaining: 1,
                    //     broadcastMsg: '2',
                    //     currentStage: 3,
                    //     maxStage: 6,
                    //     isFinalStage: true,
                    //     firstSend: true,
                    // };
                    if (d.code === '200') {
                        setLastSendStage(safeStageToSend);
                        setSendRelult(d.content);
                        setShowResult(true);
                        // 弹窗按本次实际赠送阶段展示，避免被进度阶段覆盖
                        setCurrentStage(safeStageToSend - 1);
                        getUserInfo();
                    }
                });
        },
        [ticket, infoUser, currentUser, stages, voiceUser, getUserInfo],
    );

    // let btnContent = null;

    let btnContent = null;
    if (currentStage === -1) {
        //初始化
        btnContent = (
            <>
                <div className="btns_1" onClick={sendFn} data-quantity="1">
                    <div>赠送1个</div>
                    <div>概率解锁</div>
                </div>
                <div className="btns_2" onClick={sendFn} data-quantity={'5'}>
                    <div>赠送5个</div>
                    <div>一键解锁</div>
                </div>
            </>
        );
    } else if (currentStage > -1) {
        if (currentStage === currentStatus - 2) {
            // 是当前解锁的
            if (btnLast) {
                btnContent = (
                    <div
                        className="btns_2"
                        onClick={sendFn}
                        data-quantity={
                            info && info.pityLimit - info.pityCounter
                        }
                    >
                        <div>
                            赠送{info && info.pityLimit - info.pityCounter}个
                        </div>
                        <div>一键解锁</div>
                    </div>
                );
            } else {
                if (currentStage === 5) {
                    btnContent = (
                        <>
                            <div
                                className="btns_1"
                                onClick={sendFn}
                                data-quantity="1"
                            >
                                <div>赠送1个</div>
                                <div>荣登永恒见证</div>
                            </div>
                        </>
                    );
                } else {
                    btnContent = (
                        <>
                            <div
                                className="btns_1"
                                onClick={sendFn}
                                data-quantity="1"
                            >
                                <div>赠送1个</div>
                                <div>概率解锁</div>
                            </div>
                            <div
                                className="btns_2"
                                onClick={sendFn}
                                data-quantity={
                                    info && info.pityLimit - info.pityCounter
                                }
                            >
                                <div>
                                    赠送
                                    {info && info.pityLimit - info.pityCounter}
                                    个
                                </div>
                                <div>一键解锁</div>
                            </div>
                        </>
                    );
                }
            }
        } else {
            btnContent = (
                <>
                    <div
                        className="btns_2"
                        onClick={sendFn}
                        data-quantity={'1'}
                    >
                        <div>赠送1个</div>
                    </div>
                </>
            );
        }
    }

    // useEffect(() => {
    //     appGate.listen('300').then((data) => {
    //         if (data.content.typeID === '300') {
    //             // setEventData(data.content.content);
    //         }
    //     });
    // }, []);

    useEffect(() => {
        setTitle('心动感应');
        getRank();
        getUserInfo();
        getUserVoice();
    }, [getRank, getUserInfo, getUserVoice]);

    useEffect(() => {
        if (!showRank) return;
        const rankingType = Number(tabKey || '1');
        setRankingState((prev) => ({
            ...prev,
            [rankingType]: buildPageState(),
        }));
        fetchRankingPage(rankingType, 1, false);
    }, [showRank, tabKey, fetchRankingPage]);

    const currentRankingType = Number(tabKey);
    const currentRankingState =
        rankingState[currentRankingType] || buildPageState();
    const loadMoreRank = useCallback(() => {
        if (currentRankingState.loading || !currentRankingState.hasMore) {
            return Promise.resolve();
        }
        return fetchRankingPage(
            currentRankingType,
            currentRankingState.page + 1,
            true,
        );
    }, [currentRankingState, currentRankingType, fetchRankingPage]);

    let mainContent = null;
    if (!info && !infoUser) {
        mainContent = <BlockLoading />;
    } else if (info && infoUser) {
        let nameText;
        if (currentText > 0 && currentText < 7) {
            nameText = (
                <div className="g_text">
                    {currentText > 0
                        ? stages.find((i) => i.stage === currentText - 1)
                              .giftName
                        : '恋恋相遇'}
                </div>
            );
        } else if (currentText === 0 && currentText === 0) {
            nameText = <div className="g_text">恋恋相遇</div>;
        } else {
            nameText = <div className="g_text">命定双生</div>;
        }

        mainContent = (
            <Fragment>
                {!showRank && (
                    <Fragment>
                        <div className="heart__title"></div>
                        <div className="heart__warp-banner">
                            <div className="rule__icon" onClick={ruleFn}>
                                规则
                            </div>
                            <div className="rank__icon" onClick={rankFn}>
                                <span></span>
                                <span>榜单</span>
                            </div>
                            <div className="money__icon">
                                <span></span>
                                <span>{infoUser.coin}</span>
                            </div>
                            <div className="ra_tips">
                                触发心动感应，解锁专属恋爱进阶之路
                            </div>
                            <div className="users-warp">
                                <div className="users-warp-left">请选择</div>
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
                            <div className="heart__main">
                                <div className="gift_ul">
                                    <ul>
                                        {stages.map((item, index) => {
                                            let liContent = null;
                                            if (item.status === 0) {
                                                liContent = (
                                                    <li
                                                        key={index}
                                                        data-index={index}
                                                        onClick={stagesLiFn}
                                                        data-status={
                                                            item.status
                                                        }
                                                        // className={'gray_c'}
                                                    >
                                                        <div className="gift__warp"></div>
                                                        <div className="gift_name">
                                                            {item.giftName}
                                                        </div>
                                                        <div
                                                            className={
                                                                'gift_label' +
                                                                item.stage
                                                            }
                                                        >
                                                            {
                                                                StageName[
                                                                    item.stage
                                                                ]
                                                            }
                                                        </div>

                                                        <div className="acti_icon"></div>
                                                        <div className="li_suo"></div>
                                                    </li>
                                                );
                                            } else if (item.status === 1) {
                                                liContent = (
                                                    <li
                                                        key={index}
                                                        data-index={index}
                                                        onClick={stagesLiFn}
                                                        data-status={
                                                            item.status
                                                        }
                                                    >
                                                        <div className="gift__warp"></div>
                                                        <div className="gift_name">
                                                            {item.giftName}
                                                        </div>
                                                        {/* 赠送$
                                                        {
                                                            StageName[
                                                                currentStatus +
                                                                    1
                                                            ]
                                                        } */}
                                                        <div className="gift_text2">
                                                            {currentStatus < 6
                                                                ? probability
                                                                    ? `${probability}%概率解锁`
                                                                    : `${item.unlockProbability}%概率解锁`
                                                                : ''}
                                                        </div>
                                                        <div
                                                            className={
                                                                'gift_label' +
                                                                item.stage
                                                            }
                                                        >
                                                            {
                                                                StageName[
                                                                    item.stage
                                                                ]
                                                            }
                                                        </div>
                                                        <div className="acti_icon"></div>
                                                        <div className="li_suo"></div>
                                                    </li>
                                                );
                                            } else {
                                                liContent = (
                                                    <li
                                                        key={index}
                                                        data-index={index}
                                                        onClick={
                                                            currentStage === -1
                                                                ? () => {}
                                                                : stagesLiFn
                                                        }
                                                        data-status={
                                                            item.status
                                                        }
                                                        className={
                                                            currentStage === -1
                                                                ? 'activeLi'
                                                                : currentStage ===
                                                                    index
                                                                  ? 'activeLi'
                                                                  : ''
                                                        }
                                                    >
                                                        <div className="gift__warp">
                                                            <img
                                                                src={
                                                                    item.giftIcon
                                                                }
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="gift_name">
                                                            {item.giftName}
                                                        </div>
                                                        <div
                                                            className={
                                                                'gift_label' +
                                                                item.stage
                                                            }
                                                        >
                                                            {
                                                                StageName[
                                                                    item.stage
                                                                ]
                                                            }
                                                        </div>
                                                        <div className="gift_money">
                                                            <span></span>
                                                            <span>
                                                                {item.giftValue}
                                                            </span>
                                                        </div>
                                                        <div className="acti_icon"></div>
                                                    </li>
                                                );
                                            }

                                            return (
                                                <Fragment key={index}>
                                                    {liContent}
                                                </Fragment>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="gift_user">
                                    <div className="g_user-1">
                                        <img src={infoUser.head_img} alt="" />
                                    </div>
                                    <div className="g_user-2">
                                        {currentUser !== null ? (
                                            <img
                                                src={
                                                    voiceUser[currentUser]
                                                        .avatar
                                                }
                                                alt=""
                                            />
                                        ) : (
                                            <img
                                                src={noTou_Img + '/no_tou.png'}
                                                alt=""
                                            />
                                        )}
                                    </div>
                                    <div className="heart_icon"></div>
                                </div>
                                {nameText}

                                <div className="btns_warp">{btnContent}</div>
                            </div>
                        </div>
                    </Fragment>
                )}

                {showRank && (
                    <div className="heart__rank-warp">
                        <div className="rank__nav">
                            <div
                                className="rank__rank-icon"
                                onClick={() => {
                                    setShowRank(false);
                                }}
                            ></div>
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
                                        title={
                                            <div className="text__tab">
                                                此刻心动
                                            </div>
                                        }
                                        key="1"
                                    >
                                        <RankContent
                                            data={rankingState[1].items}
                                            tabKey={tabKey}
                                            hasMore={rankingState[1].hasMore}
                                            currentPage={rankingState[1].page}
                                            loadMore={loadMoreRank}
                                            initialized={
                                                rankingState[1].initialized
                                            }
                                        ></RankContent>
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        title={
                                            <div className="text__tab">
                                                永恒见证
                                            </div>
                                        }
                                        key="2"
                                    >
                                        <RankTwoContent
                                            data={rankingState[2].items}
                                            tabKey={tabKey}
                                            hasMore={rankingState[2].hasMore}
                                            currentPage={rankingState[2].page}
                                            loadMore={loadMoreRank}
                                            initialized={
                                                rankingState[2].initialized
                                            }
                                        ></RankTwoContent>
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        title={
                                            <div className="text__tab">
                                                心动日记
                                            </div>
                                        }
                                        key="3"
                                    >
                                        <RankThreeContent
                                            data={rankingState[3].items}
                                            tabKey={tabKey}
                                            hasMore={rankingState[3].hasMore}
                                            currentPage={rankingState[3].page}
                                            loadMore={loadMoreRank}
                                            initialized={
                                                rankingState[3].initialized
                                            }
                                        ></RankThreeContent>
                                    </Tabs.Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                )}
            </Fragment>
        );
    }

    return (
        <div
            className={
                (tabKey === '3' ? 'heart__warp heart__warp3' : 'heart__warp') +
                (searchParam.room === 'full' ? ' week__full' : '')
            }
        >
            {mainContent}
            {showRule && <RuleAlert setShow={setShowRule}></RuleAlert>}
            {showResult && (
                <Resultalert
                    infoUser={infoUser}
                    currentUser={currentUser}
                    voiceUser={voiceUser}
                    currentStage={currentStage}
                    stages={stages}
                    sendRelult={sendRelult}
                    setShow={setShowResult}
                    setShowRank={setShowRank}
                    sendFn={sendFn}
                    getProgressFn={getProgressFn}
                    currentStatus={currentStatus}
                    currentStageOrigin={currentStageOrigin}
                    setTabFn={setTabFn}
                    lastSendStage={lastSendStage}
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
