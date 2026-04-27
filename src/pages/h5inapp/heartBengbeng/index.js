import './index.scss';

import React, { useState, useCallback, useEffect, Fragment } from 'react';

import { connect } from 'react-redux';
import { Tabs } from 'antd-mobile';

import CenterOverlay from '@/component/CenterOverlay';
import Portal from '@/component/Protal';
import DawerOverlay from '@/component/DawerOverlay';

import urlTool from 'ox-util/src/url';
import setTitle from '@/utility/settitle.js';
import { appGate } from '@/utility/appGate.js';
import instance from '@/request/index';
import { BlockLoading } from '@/component/PageLoading';

const searchParam = urlTool.param(window.location.search);

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

const Resultalert = ({ setShow, tabKeyv, timeCurrent, status }) => {
    const closeAlert = useCallback(() => {
        setShow(false);
    }, [setShow]);

    return (
        <Portal>
            <CenterOverlay className="result-alert" onClose={closeAlert}>
                <div className="result_user">
                    <div className="result_user_user-1">
                        <img src="" alt="" />
                    </div>
                    <div className="result_user_user-2">
                        <img src="" alt="" />
                    </div>
                    <div className="r_heart_icon"></div>
                </div>
                <div className="r_text1">
                    您已向 [嘉宾B] 成功送出 [礼物名称]
                </div>
                <div className="r_text2">
                    恭喜你们成功登顶！赠送永恒礼物，即可登上【永恒见证】头条，全服可见！
                </div>
                <div className="r_btns">
                    <div className="rule_a_btn" onClick={closeAlert}>
                        取消
                    </div>
                    <div className="rule_b_btn" onClick={closeAlert}>
                        <div className="rule_b_btn-div2">继续赠送</div>
                        <div className="rule_b_btn-div1">
                            <span></span>
                            <span>1000</span>
                        </div>
                    </div>
                </div>
            </CenterOverlay>
        </Portal>
    );
};

const RankContent = ({ rankData, tabKey }) => {
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
    if (rankData && rankData.list.length === 0) {
        liContent = <li className="li__nodata">暂无数据</li>;
    } else if (rankData && rankData.list.length > 0) {
        liContent =
            rankData &&
            rankData.list.map((item, index) => {
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
                                <img src="" alt="" />
                            </div>
                            <div className="one_info-2">
                                <img src="" alt="" />
                            </div>
                            <div className="one_info-heart"></div>
                        </div>
                        <div className="rank_one-text"></div>
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
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

const RankTwoContent = ({ rankData, tabKey }) => {
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
    if (rankData && rankData.list.length === 0) {
        liContent = <li className="li__nodata">暂无数据</li>;
    } else if (rankData && rankData.list.length > 0) {
        liContent =
            rankData &&
            rankData.list.map((item, index) => {
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
                                <img src="" alt="" />
                            </div>
                            <div className="one_info-2">
                                <img src="" alt="" />
                            </div>
                            <div className="one_info-heart"></div>
                        </div>
                        <div className="rank_one-alias">
                            <div>用户昵称</div>
                            <div>用户昵称</div>
                        </div>
                        <div className="rank_one-text"></div>
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
                            <div>
                                你的每一次“命定双生”，都是对TA的再次承诺
                                每次赠礼都会被见证，置顶展示
                            </div>
                            <ul>{liContent}</ul>
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

    const getRank = useCallback(
        (propId) => {
            instance
                .post('/api/v1/zhouXin/list', {
                    type: propId,
                    rid: searchParam.ruid,
                    token: ticket,
                })
                .then((d) => {
                    d.content = {
                        list: [
                            {
                                pic: 'https://s1.yuewankeji.top/dev/2023-09-14/20-100ht1694696251720356116.jpg?x-oss-process=image/resize,w_240,h_240',
                                name: '小二和',
                                rank: 1,
                                difNum: '0',
                            },
                        ],
                    };
                    setInfo(d.content);
                });
        },
        [ticket],
    );

    const setTabFn = useCallback(
        (key) => {
            setTabKey(key);
            getRank(key);
        },
        [getRank],
    );
    const ruleFn = useCallback((key) => {
        setShowRule(true);
    }, []);
    const rankFn = useCallback((key) => {
        setShowRank(true);
    }, []);

    useEffect(() => {
        setTitle('周星');
        getRank('1');
    }, [getRank]);

    let mainContent = null;
    if (!info) {
        mainContent = <BlockLoading />;
    } else if (info) {
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
                                <span>1.2w</span>
                            </div>
                            <div className="ra_tips">
                                触发心动感应，解锁专属恋爱进阶之路
                            </div>
                            <div className="users-warp">
                                <div className="users-warp-left">请选择</div>
                                <div className="users-warp-right">
                                    <ul>
                                        <li>
                                            <div className="users_right-spic">
                                                <img src="" alt="" />
                                            </div>
                                            <div className="right-spic-icon">
                                                主持
                                            </div>
                                        </li>
                                        <li>
                                            <div className="users_right-spic">
                                                <img src="" alt="" />
                                            </div>
                                            <div className="right-spic-icon">
                                                老板
                                            </div>
                                        </li>
                                        <li>
                                            <div className="users_right-spic">
                                                <img src="" alt="" />
                                            </div>
                                            <div className="right-spic-icon">
                                                1
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="heart__main">
                                <div className="gift_ul">
                                    <ul>
                                        <li>
                                            <div className="gift__warp">
                                                <img src="" alt="" />
                                            </div>
                                            <div className="gift_name">
                                                礼物名称
                                            </div>
                                            <div className="gift_label">
                                                同频
                                            </div>
                                            <div className="gift_money">
                                                <span></span>
                                                <span>1000</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="gift_user">
                                    <div className="g_user-1">
                                        <img src="" alt="" />
                                    </div>
                                    <div className="g_user-2">
                                        <img src="" alt="" />
                                    </div>
                                    <div className="heart_icon"></div>
                                </div>
                                <div className="g_text">恋恋相遇</div>
                                <div className="btns_warp">
                                    <div className="btns_1">
                                        <div>赠送一个</div>
                                        <div>概率解锁</div>
                                    </div>
                                    <div className="btns_2">
                                        <div>赠送10个</div>
                                        <div>一键解锁</div>
                                    </div>
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
                                                高光榜
                                            </div>
                                        }
                                        key="1"
                                    >
                                        <RankContent
                                            rankData={info}
                                            tabKey={tabKey}
                                        ></RankContent>
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        title={
                                            <div className="text__tab">
                                                守护榜
                                            </div>
                                        }
                                        key="2"
                                    >
                                        <RankTwoContent
                                            rankData={info}
                                            tabKey={tabKey}
                                        ></RankTwoContent>
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        title={
                                            <div className="text__tab">
                                                房间榜
                                            </div>
                                        }
                                        key="3"
                                    >
                                        <RankContent
                                            rankData={info}
                                            tabKey={tabKey}
                                        ></RankContent>
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
            {showResult && <Resultalert setShow={setShowResult}></Resultalert>}
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
