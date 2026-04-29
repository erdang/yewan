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

const RuleAlert = ({ setShow, tabKeyv, timeCurrent, status }) => {
    const closeAlert = useCallback(() => {
        setShow(false);
    }, [setShow]);

    return (
        <Portal>
            <CenterOverlay className="weekstar-alert" onClose={closeAlert}>
                <div className="title-icon"></div>
                <div className="rule__h1">
                    1.解锁流程：用户向麦上嘉宾赠送场景N礼物➤概率触发解锁阶段N+1送礼资格
                    <br />
                    2.
                    双方解锁某阶段后，双方都可以赠送已解锁阶段的礼物（无需再次解锁）
                    <br />
                    3. 用户与每一位嘉宾的互动进度独立计算，互不影响。
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
}) => {
    const closeAlert = useCallback(() => {
        setShow(false);
    }, [setShow]);

    const giftName = stages.find((i) => i.stage === currentStage + 1);
    const nextStage = stages.find((i) => i.stage === sendRelult.newStage);
    console.log(nextStage);
    let messageContent = null;
    if (sendRelult.unlocked === false) {
        if (sendRelult.isFinalStage) {
            messageContent = `恭喜你们成功登顶！赠送永恒礼物，即可登上【永恒见证】头条，全服可见！`;
        } else if (sendRelult.firstSend) {
            messageContent = `成功登上【永恒见证】头条！珍藏此刻！`;
        } else if (currentStage + 1 < sendRelult.currentStage) {
            messageContent = null;
        } else {
            messageContent = `信号越来越强烈，再赠送 ${sendRelult.pityRemaining} 次，必解锁下一场景！`;
        }
    } else if (sendRelult.unlocked === true) {
        messageContent = `成功抵达【${nextStage.name}】触发心动头条！`;
    }

    return (
        <Portal>
            <CenterOverlay className="result-alert" onClose={closeAlert}>
                <div className="result_user">
                    <div className="result_user_user-1">
                        <img src={infoUser && infoUser.head_img} alt="" />
                    </div>
                    <div className="result_user_user-2">
                        <img
                            src={currentUser && voiceUser[currentUser].avatar}
                            alt=""
                        />
                    </div>
                    <div className="r_heart_icon"></div>
                </div>
                <div className="r_text1">
                    您已向 [{currentUser && voiceUser[currentUser].nickname}]
                    成功送出 [{giftName.giftName}]
                </div>
                <div className="r_text2">
                    {messageContent}
                    {/* 恭喜你们成功登顶！赠送永恒礼物，即可登上【永恒见证】头条，全服可见！ */}
                </div>
                <div className="r_btns">
                    <div className="rule_a_btn" onClick={closeAlert}>
                        取消
                    </div>
                    <div className="rule_b_btn" onClick={closeAlert}>
                        <div className="rule_b_btn-div2" onClick={sendFn}>
                            继续赠送
                        </div>
                        <div className="rule_b_btn-div1">
                            <span></span>
                            <span>
                                {giftName.giftValue * sendRelult.pityRemaining}
                            </span>
                        </div>
                    </div>
                </div>
            </CenterOverlay>
        </Portal>
    );
};

const RankContent = ({ rankData, tabKey, ticket }) => {
    const [hasMore, setHasMore] = useState(true);
    const [data, setData] = useState(() => {
        return rankData ? rankData.items : [];
    });
    const todayPage = useRef(2);
    const loadMore = useCallback(() => {
        return instance
            .get('/api/activity/headlines/moment', {
                params: {
                    token: ticket,
                    page: todayPage.current,
                    pageSize: 10,
                    activityId: 1,
                },
            })
            .then((d) => {
                if (d.code === '200') {
                    setData((val) => [...val, ...d.content.items]);
                    if (d.content.items.length > 0) {
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }
                    todayPage.current++;
                }
            });
    }, [ticket]);
    const toFunction = useCallback((event) => {
        // let rid = event.currentTarget.dataset.rid;
        let uid = event.currentTarget.dataset.uid;

        if (searchParam.room === 'full' && uid) {
            appGate.openProfilePage(uid);
        }
    }, []);
    const toRoomFunction = useCallback((event) => {
        // let rid = event.currentTarget.dataset.rid;
        let uid = event.currentTarget.dataset.uid;

        if (searchParam.room === 'full' && uid) {
            appGate.openRoom(uid);
        }
    }, []);

    let liContent = null;
    if (data && data.length === 0) {
        liContent = <li className="li__nodata">暂无数据</li>;
    } else if (data && data.length > 0) {
        liContent =
            rankData &&
            data.map((item, index) => {
                return (
                    <li key={index}>
                        <div className="rank_one-info">
                            <div
                                className="one_info-1"
                                onClick={
                                    tabKey !== '3' ? toFunction : toRoomFunction
                                }
                                data-uid={item.uid}
                            >
                                <img src={item.senderAvatar} alt="" />
                            </div>
                            <div className="one_info-2">
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
            {rankData && (
                <div className="heart__rank rank_one-warp">
                    <div className="rank__tab">
                        <div className="rank__tab-content">
                            <ul>{liContent}</ul>
                            {rankData.total > 1 && (
                                <InfiniteScroll
                                    loadMore={loadMore}
                                    hasMore={hasMore}
                                    threshold={0}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};
const RankThreeContent = ({ rankData, tabKey, ticket }) => {
    const [hasMore, setHasMore] = useState(true);
    const [data, setData] = useState(() => {
        return rankData ? rankData.items : [];
    });
    const todayPage = useRef(2);
    const loadMore = useCallback(() => {
        return instance
            .get('/api/activity/headlines/diary', {
                params: {
                    token: ticket,
                    page: todayPage.current,
                    pageSize: 10,
                    activityId: 1,
                },
            })
            .then((d) => {
                if (d.code === '200') {
                    setData((val) => [...val, ...d.content.items]);
                    if (d.content.items.length > 0) {
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }
                    todayPage.current++;
                }
            });
    }, [ticket]);
    const toFunction = useCallback((event) => {
        // let rid = event.currentTarget.dataset.rid;
        let uid = event.currentTarget.dataset.uid;

        if (searchParam.room === 'full' && uid) {
            appGate.openProfilePage(uid);
        }
    }, []);
    const toRoomFunction = useCallback((event) => {
        // let rid = event.currentTarget.dataset.rid;
        let uid = event.currentTarget.dataset.uid;

        if (searchParam.room === 'full' && uid) {
            appGate.openRoom(uid);
        }
    }, []);
    // {
    //     guestId: 0,
    //                         guestName: '嘉宾',
    //                         guestAvatar: '',
    //                         senderId: 0,
    //                         senderName: '送礼人',
    //                         senderAvatar: '',
    //                         receiverId: 0,
    //                         receiverName: '收礼人',
    //                         receiverAvatar: '',
    //                         currentStage: 2,
    //                         stageName: '阶段2',
    //                         lastUnlockTime: 212312312312,
    //                         roomId: 0,
    // }
    let liContent = null;
    if (data && data.length === 0) {
        liContent = <li className="li__nodata">暂无数据</li>;
    } else if (data && data.length > 0) {
        liContent =
            rankData &&
            data.map((item, index) => {
                return (
                    <li key={index}>
                        <div className="li_three-time">
                            <div>
                                {formatTime(
                                    item.lastUnlockTime * 1000,
                                    'y-m-d',
                                )}
                            </div>
                            <div>已完成[场景]阶段 ({item.currentStage}/6）</div>
                        </div>
                        <div className="li_three-div">
                            <div className="rank_one-info">
                                <div
                                    className="one_info-1"
                                    onClick={
                                        tabKey !== '3'
                                            ? toFunction
                                            : toRoomFunction
                                    }
                                    data-uid={item.uid}
                                >
                                    <img src={item.senderAvatar} alt="" />
                                </div>
                                <div className="one_info-2">
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
            {rankData && (
                <div className="heart__rank rank_three-warp">
                    <div className="rank__tab">
                        <div className="rank__tab-content">
                            <ul>{liContent}</ul>
                            {rankData.total > 1 && (
                                <InfiniteScroll
                                    loadMore={loadMore}
                                    hasMore={hasMore}
                                    threshold={0}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

const RankTwoContent = ({ rankData, tabKey, ticket }) => {
    const [hasMore, setHasMore] = useState(true);
    const [data, setData] = useState(() => {
        return rankData ? rankData.items : [];
    });
    const todayPage = useRef(2);
    const loadMore = useCallback(() => {
        return instance
            .get('/api/activity/headlines/eternal', {
                params: {
                    token: ticket,
                    page: todayPage.current,
                    pageSize: 10,
                    activityId: 1,
                },
            })
            .then((d) => {
                if (d.code === '200') {
                    setData((val) => [...val, ...d.content.items]);
                    if (d.content.items.length > 0) {
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }
                    todayPage.current++;
                }
            });
    }, [ticket]);
    const toFunction = useCallback((event) => {
        // let rid = event.currentTarget.dataset.rid;
        let uid = event.currentTarget.dataset.uid;

        if (searchParam.room === 'full' && uid) {
            appGate.openProfilePage(uid);
        }
    }, []);
    const toRoomFunction = useCallback((event) => {
        // let rid = event.currentTarget.dataset.rid;
        let uid = event.currentTarget.dataset.uid;

        if (searchParam.room === 'full' && uid) {
            appGate.openRoom(uid);
        }
    }, []);

    let liContent = null;
    if (data && data.length === 0) {
        liContent = <li className="li__nodata">暂无数据</li>;
    } else if (data && data.length > 0) {
        liContent =
            data &&
            data.map((item, index) => {
                return (
                    <li key={index}>
                        <div className="rank_one-info">
                            <div
                                className="one_info-1"
                                onClick={
                                    tabKey !== '3' ? toFunction : toRoomFunction
                                }
                                data-uid={item.uid}
                            >
                                <img src={item.senderAvatar} alt="" />
                            </div>
                            <div className="one_info-2">
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
            {rankData && (
                <div className="heart__rank rank_two-warp">
                    <div className="rank__tab">
                        <div className="rank__tab-content">
                            <div className="rank_two-tips">
                                你的每一次“命定双生”，都是对TA的再次承诺
                                每次赠礼都会被见证，置顶展示
                            </div>
                            <ul>{liContent}</ul>
                            {rankData.total > 1 && (
                                <InfiniteScroll
                                    loadMore={loadMore}
                                    hasMore={hasMore}
                                    threshold={0}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

const RankTemplate = ({ ticket }) => {
    const [showRule, setShowRule] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showRank, setShowRank] = useState(false);
    const [tabKey, setTabKey] = useState('1');

    const [info, setInfo] = useState('');
    const [infoUser, setInfoUser] = useState('');
    const [voiceUser, setVoiceUser] = useState([]);
    const [stages, setStages] = useState([]);
    const [currentStage, setCurrentStage] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [infoRank, setInfoRank] = useState('');
    const [infoRankTwo, setInfoRankTwo] = useState('');
    const [infoRankThree, setInfoRankThree] = useState('');

    const [currentStatus, setCurrentStatus] = useState(0);
    const [currentText, setCurrentText] = useState(0);
    const [sendRelult, setSendRelult] = useState('');

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
                room_id: searchParam.roomid,
            })
            .then((e) => {
                e.content = [
                    {
                        rid: '10',
                        uid: '49',
                        avatar: 'https://s3.njxianyuwl.cn/dev/2026-03-31/21-103/1774965247873222536.png',
                        nickname: '曾经的鞋子',
                        sex: '1',
                        volume: '2',
                        seat: '99',
                        seatFormat: '老板',
                        rank: '0',
                        avatarFrame: '',
                        sound_wave_id: '',
                        wheat_msg: '',
                        wheat_img:
                            'https://s3.njxianyuwl.cn/dev/2023-11-29/17-103ht1701249711772920315.png',
                    },
                    {
                        rid: '10',
                        uid: '61',
                        avatar: 'https://s3.njxianyuwl.cn/dev/2026-03-31/21-103/1774965305047829391.png',
                        nickname: '富有想象力的汉堡',
                        sex: '2',
                        volume: '2',
                        seat: '88',
                        seatFormat: '主持',
                        rank: '0',
                        avatarFrame: '',
                        sound_wave_id: '',
                        wheat_msg: '',
                        wheat_img:
                            'https://s3.njxianyuwl.cn/dev/2023-11-29/17-103ht1701249711772920315.png',
                    },
                    {
                        rid: '10',
                        uid: '54',
                        avatar: 'https://s3.njxianyuwl.cn/dev/2026-03-31/21-103/1774965280005663532.png',
                        nickname: '孤独的仙人掌',
                        sex: '2',
                        volume: '2',
                        seat: '1',
                        seatFormat: '1',
                        rank: '0',
                        avatarFrame: '',
                        sound_wave_id: '',
                        wheat_msg: '',
                        wheat_img:
                            'https://s3.njxianyuwl.cn/dev/2023-11-29/17-103ht1701249711772920315.png',
                    },
                    {
                        rid: '10',
                        uid: '62',
                        avatar: 'https://s3.njxianyuwl.cn/dev/2026-03-31/21-103/1774965247873222536.png',
                        nickname: '率真的老鼠',
                        sex: '2',
                        volume: '2',
                        seat: '2',
                        seatFormat: '2',
                        rank: '0',
                        avatarFrame: '',
                        sound_wave_id: '',
                        wheat_msg: '',
                        wheat_img:
                            'https://s3.njxianyuwl.cn/dev/2023-11-29/17-103ht1701249711772920315.png',
                    },
                    {
                        rid: '10',
                        uid: '50',
                        avatar: 'https://s3.njxianyuwl.cn/dev/2026-03-31/21-103/1774965280005663532.png',
                        nickname: '娇气的白昼',
                        sex: '1',
                        volume: '2',
                        seat: '3',
                        seatFormat: '2',
                        rank: '0',
                        avatarFrame: '',
                        sound_wave_id: '',
                        wheat_msg: '',
                        wheat_img:
                            'https://s3.njxianyuwl.cn/dev/2023-11-29/17-103ht1701249711772920315.png',
                    },
                    {
                        rid: '10',
                        uid: '50',
                        avatar: 'https://s3.njxianyuwl.cn/dev/2026-03-31/21-103/1774965280005663532.png',
                        nickname: '娇气的白昼',
                        sex: '1',
                        volume: '2',
                        seat: '3',
                        seatFormat: '2',
                        rank: '0',
                        avatarFrame: '',
                        sound_wave_id: '',
                        wheat_msg: '',
                        wheat_img:
                            'https://s3.njxianyuwl.cn/dev/2023-11-29/17-103ht1701249711772920315.png',
                    },
                    {
                        rid: '10',
                        uid: '50',
                        avatar: 'https://s3.njxianyuwl.cn/dev/2026-03-31/21-103/1774965280005663532.png',
                        nickname: '娇气的白昼',
                        sex: '1',
                        volume: '2',
                        seat: '3',
                        seatFormat: '2',
                        rank: '0',
                        avatarFrame: '',
                        sound_wave_id: '',
                        wheat_msg: '',
                        wheat_img:
                            'https://s3.njxianyuwl.cn/dev/2023-11-29/17-103ht1701249711772920315.png',
                    },
                ];
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
                console.log(d);
                setInfo(d.content);
                setStages(d.content.stages);
                setCurrentStage(-1);
            });
    }, [ticket]);

    const getRankInfo = useCallback(() => {
        instanceGame
            .get('/api/activity/headlines/moment', {
                params: {
                    activityId: 1,
                    page: 1,
                    pageSize: 10,
                    token: ticket,
                },
            })
            .then((d) => {
                setInfoRank(d.content);
            });
    }, [ticket]);

    const getRankInfoTwo = useCallback(() => {
        instanceGame
            .get('/api/activity/headlines/eternal', {
                params: {
                    activityId: 1,
                    page: 1,
                    pageSize: 10,
                    token: ticket,
                },
            })
            .then((d) => {
                d.content = {
                    items: [
                        {
                            message:
                                '用户A送出1个心动礼物，触发了心动感应，成功解锁了与嘉宾B的恋爱进阶之路',
                            senderAvatar: '',
                            senderName: '用户A',
                            receiverName: '嘉宾B',
                            receiverAvatar: '',
                        },
                    ],
                    total: 1,
                };
                setInfoRankTwo(d.content);
            });
    }, [ticket]);
    const getRankInfoThree = useCallback(() => {
        instanceGame
            .get('/api/activity/headlines/diary', {
                params: {
                    activityId: 1,
                    page: 1,
                    pageSize: 10,
                    token: ticket,
                },
            })
            .then((d) => {
                d.content = {
                    items: [
                        {
                            guestId: 0,
                            guestName: '嘉宾',
                            guestAvatar: '',
                            senderId: 0,
                            senderName: '送礼人',
                            senderAvatar: '',
                            receiverId: 0,
                            receiverName: '收礼人',
                            receiverAvatar: '',
                            currentStage: 2,
                            stageName: '阶段2',
                            lastUnlockTime: 212312312312,
                            roomId: 0,
                        },
                    ],
                    total: 1,
                };
                setInfoRankThree(d.content);
            });
    }, [ticket]);

    const setTabFn = useCallback(
        (key) => {
            setTabKey(key);
            if (key === '1') {
                getRankInfo();
            } else if (key === '2') {
                getRankInfoTwo();
            } else {
                getRankInfoThree();
            }
        },
        [getRankInfo, getRankInfoTwo, getRankInfoThree],
    );
    const ruleFn = useCallback((key) => {
        setShowRule(true);
    }, []);
    const rankFn = useCallback((key) => {
        setShowRank(true);
    }, []);

    const stagesLiFn = useCallback(
        (event) => {
            let index = event.currentTarget.dataset.index;
            let unlocked = event.currentTarget.dataset.unlocked;

            if (
                (unlocked === 'false' && voiceUser !== null) ||
                (unlocked === undefined && index > 0)
            ) {
                Dialog.alert({
                    content: '请按场景顺序解锁哦！',
                    confirmText: '确定',
                    onConfirm: () => {},
                });
                return false;
            }
            console.log(currentStatus);
            setCurrentStage(Number(index));
            setCurrentStatus(0);
        },
        [voiceUser, currentStatus],
    );

    const getProgressFn = useCallback(
        async (uid) => {
            instanceGame
                .get('/api/activity/progress', {
                    params: {
                        activityId: 1,
                        guestId: uid,
                        token: ticket,
                    },
                })
                .then((d) => {
                    d.content.currentStage = 6;
                    d.content.pityLimit = 8;
                    d.content.pityCounter = 7;
                    if (d.code === '200') {
                        setInfo(d.content);
                        setStages(d.content.stages);
                        setCurrentStatus(d.content.currentStage);
                        setCurrentText(d.content.currentStage);
                        setCurrentStage(d.content.currentStage - 1);
                    }
                });
        },
        [ticket],
    );

    const voiceUserLiFn = useCallback(
        (event) => {
            let index = event.currentTarget.dataset.index;
            let uid = event.currentTarget.dataset.suid;
            setCurrentUser(Number(index));
            getProgressFn(uid);
        },
        [getProgressFn],
    );

    const sendFn = useCallback(
        (event) => {
            let quantity = event.currentTarget.dataset.quantity;
            if (currentUser === null) {
                Dialog.alert({
                    content: '请选择接收感应的CP！',
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
                    stage: currentStage + 1,
                    quantity: Number(quantity),
                    token: ticket,
                })
                .then((d) => {
                    //currentStage：送礼后当前阶段
                    // maxStage：最大阶段（当前是 6）
                    // isFinalStage：是否已到最终阶段
                    // firstSend：该送礼方对该收礼方在本活动是否首次送出
                    d.content = {
                        unlocked: false,
                        newStage: 2,
                        pityRemaining: 1,
                        broadcastMsg: '2',
                        currentStage: 3,
                        maxStage: 6,
                        isFinalStage: true,
                        firstSend: true,
                    };
                    setSendRelult(d.content);
                    setShowResult(true);
                });
        },
        [ticket, infoUser, currentUser, voiceUser, currentStage],
    );

    const btnContent = {
        1: (
            <>
                <div className="btns_1" data-quantity="1" onClick={sendFn}>
                    <div>赠送1个</div>
                    <div>概率解锁</div>
                </div>
                <div className="btns_2" data-quantity="5" onClick={sendFn}>
                    <div>赠送5个</div>
                    <div>一键解锁</div>
                </div>
            </>
        ),
        2: (
            <>
                {info && info.pityLimit - info.pityCounter === 1 ? (
                    <div
                        className="btns_2"
                        data-quantity={
                            info && info.pityLimit - info.pityCounter
                        }
                        onClick={sendFn}
                    >
                        <div>
                            赠送{info && info.pityLimit - info.pityCounter}个
                        </div>
                        <div>一键解锁</div>
                    </div>
                ) : (
                    <>
                        <div
                            className="btns_1"
                            data-quantity="1"
                            onClick={sendFn}
                        >
                            <div>赠送1个</div>
                            <div>概率解锁</div>
                        </div>
                        <div
                            className="btns_2"
                            data-quantity={
                                info && info.pityLimit - info.pityCounte
                            }
                            onClick={sendFn}
                        >
                            <div>
                                赠送{info && info.pityLimit - info.pityCounter}
                                个
                            </div>
                            <div>一键解锁</div>
                        </div>
                    </>
                )}
            </>
        ),
        3: (
            <>
                {info && info.pityLimit - info.pityCounter === 1 ? (
                    <div
                        className="btns_2"
                        data-quantity={
                            info && info.pityLimit - info.pityCounter
                        }
                        onClick={sendFn}
                    >
                        <div>
                            赠送{info && info.pityLimit - info.pityCounter}个
                        </div>
                        <div>一键解锁</div>
                    </div>
                ) : (
                    <>
                        <div
                            className="btns_1"
                            data-quantity="1"
                            onClick={sendFn}
                        >
                            <div>赠送1个</div>
                            <div>概率解锁</div>
                        </div>
                        <div
                            className="btns_2"
                            data-quantity={
                                info && info.pityLimit - info.pityCounter
                            }
                            onClick={sendFn}
                        >
                            <div>
                                赠送{info && info.pityLimit - info.pityCounter}
                                个
                            </div>
                            <div>一键解锁</div>
                        </div>
                    </>
                )}
            </>
        ),
        4: (
            <>
                {info && info.pityLimit - info.pityCounter === 1 ? (
                    <div
                        className="btns_2"
                        data-quantity={
                            info && info.pityLimit - info.pityCounter
                        }
                        onClick={sendFn}
                    >
                        <div>
                            赠送{info && info.pityLimit - info.pityCounter}个
                        </div>
                        <div>一键解锁</div>
                    </div>
                ) : (
                    <>
                        <div
                            className="btns_1"
                            data-quantity="1"
                            onClick={sendFn}
                        >
                            <div>赠送1个</div>
                            <div>概率解锁</div>
                        </div>
                        <div
                            className="btns_2"
                            data-quantity={
                                info && info.pityLimit - info.pityCounter
                            }
                            onClick={sendFn}
                        >
                            <div>
                                赠送{info && info.pityLimit - info.pityCounter}
                                个
                            </div>
                            <div>一键解锁</div>
                        </div>
                    </>
                )}
            </>
        ),
        5: (
            <>
                {info && info.pityLimit - info.pityCounter === 1 ? (
                    <div
                        className="btns_2"
                        data-quantity={
                            info && info.pityLimit - info.pityCounter
                        }
                        onClick={sendFn}
                    >
                        <div>
                            赠送{info && info.pityLimit - info.pityCounter}个
                        </div>
                        <div>一键解锁</div>
                    </div>
                ) : (
                    <>
                        <div
                            className="btns_1"
                            data-quantity="1"
                            onClick={sendFn}
                        >
                            <div>赠送1个</div>
                            <div>概率解锁</div>
                        </div>
                        <div
                            className="btns_2"
                            data-quantity={
                                info && info.pityLimit - info.pityCounter
                            }
                            onClick={sendFn}
                        >
                            <div>
                                赠送{info && info.pityLimit - info.pityCounter}
                                个
                            </div>
                            <div>一键解锁</div>
                        </div>
                    </>
                )}
            </>
        ),
        6: (
            <>
                {info && info.pityLimit - info.pityCounter === 1 ? (
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
                        <div>荣登永恒见证</div>
                    </div>
                ) : (
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
                                赠送{info && info.pityLimit - info.pityCounter}
                                个
                            </div>
                            <div>一键解锁</div>
                        </div>
                    </>
                )}
            </>
        ),
    };

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
        showRank && getRankInfo();
    }, [getRankInfo, showRank]);

    let mainContent = null;
    if (!info && !infoUser) {
        mainContent = <BlockLoading />;
    } else if (info && infoUser) {
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
                                            return (
                                                <li
                                                    key={index}
                                                    data-index={index}
                                                    onClick={
                                                        currentStage === -1 &&
                                                        index === 0
                                                            ? () => {}
                                                            : stagesLiFn
                                                    }
                                                    data-unlocked={
                                                        item.unlocked
                                                    }
                                                    className={
                                                        currentStatus > 0
                                                            ? currentStatus -
                                                                  1 ===
                                                              index
                                                                ? 'activeLi'
                                                                : ''
                                                            : currentStage ===
                                                                    -1 &&
                                                                index === 0
                                                              ? 'activeLi'
                                                              : currentStage ===
                                                                  index
                                                                ? 'activeLi'
                                                                : ''
                                                    }
                                                >
                                                    <div className="gift__warp">
                                                        <img
                                                            src={item.giftIcon}
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
                                                        {item.name}
                                                    </div>
                                                    <div className="gift_money">
                                                        <span></span>
                                                        <span>
                                                            {item.giftValue}
                                                        </span>
                                                    </div>
                                                    <div className="acti_icon"></div>
                                                    {item.unlocked === undefined
                                                        ? index > 0 && (
                                                              <div className="li_suo"></div>
                                                          )
                                                        : !item.unlocked && (
                                                              <div className="li_suo"></div>
                                                          )}
                                                </li>
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
                                <div className="g_text">
                                    {currentText > 0
                                        ? stages.find(
                                              (i) => i.stage === currentText,
                                          ).giftName
                                        : '恋恋相遇'}
                                </div>
                                <div className="btns_warp">
                                    {currentStatus > 0 ? (
                                        btnContent[currentStatus]
                                    ) : currentStage === -1 ? (
                                        <>
                                            <div
                                                className="btns_1"
                                                data-quantity="1"
                                                onClick={sendFn}
                                            >
                                                <div>赠送1个</div>
                                                <div>概率解锁</div>
                                            </div>
                                            <div
                                                className="btns_2"
                                                data-quantity="5"
                                                onClick={sendFn}
                                            >
                                                <div>赠送5个</div>
                                                <div>一键解锁</div>
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            className="btns_1"
                                            data-quantity="1"
                                            onClick={sendFn}
                                        >
                                            <div>赠送1个</div>
                                        </div>
                                    )}
                                </div>
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
                                        {infoRank && (
                                            <RankContent
                                                rankData={infoRank}
                                                tabKey={tabKey}
                                                ticket={ticket}
                                            ></RankContent>
                                        )}
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        title={
                                            <div className="text__tab">
                                                永恒见证
                                            </div>
                                        }
                                        key="2"
                                    >
                                        {infoRankTwo && (
                                            <RankTwoContent
                                                rankData={infoRankTwo}
                                                tabKey={tabKey}
                                                ticket={ticket}
                                            ></RankTwoContent>
                                        )}
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        title={
                                            <div className="text__tab">
                                                心动日记
                                            </div>
                                        }
                                        key="3"
                                    >
                                        {infoRankThree && (
                                            <RankThreeContent
                                                rankData={infoRankThree}
                                                tabKey={tabKey}
                                                ticket={ticket}
                                            ></RankThreeContent>
                                        )}
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
