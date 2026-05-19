import './index.scss';

import React, { useState, useCallback, useEffect, Fragment } from 'react';

import { connect } from 'react-redux';
import { Tabs } from 'antd-mobile';

import CenterOverlay from '@/component/CenterOverlay';
import Portal from '@/component/Protal';
import DawerOverlay from '@/component/DawerOverlay';
import CutDown from '@/component/CutDown';

import urlTool from 'ox-util/src/url';
import setTitle from '@/utility/settitle.js';
import { appGate } from '@/utility/appGate.js';
import { APPNAME } from '@/utility/appName';
import instance from '@/request/index';
import { BlockLoading } from '@/component/PageLoading';

let hosthome = window.location.hostname;
let imgUrl = APPNAME[hosthome].staticUrl;
const noImg = imgUrl + '/no_tou.png';

const searchParam = urlTool.param(window.location.search);
const TAB = {
    1: {
        name: '高光榜',
    },
    2: {
        name: '守护榜',
    },
    3: {
        name: '房间榜',
    },
};

const RuleAlert = ({ setShow, tabKeyv, timeCurrent, status }) => {
    const closeAlert = useCallback(() => {
        setShow(false);
    }, [setShow]);

    return (
        <Portal>
            <CenterOverlay className="weekstar-alert" onClose={closeAlert}>
                <div className="title-icon"></div>
                <div className="rule__h1">活动规则</div>
                <p> 1.周星榜单按照每个自然周进行结算；</p>
                <p> 2.榜单值获取方式：</p>
                <p> 高光榜：收到周星礼物，1金币=1高光值</p>
                <p> 守护榜：赠送周星礼物，1金币=1守护值</p>
                <p>
                    房间榜：聊天时房间内累计收到周星礼物，1金币=1房间值（扩列房不计入数值）
                </p>
                <p>
                    3.每周结束后结算上周排名，各榜单TOP1可获得榜单奖励，其中人气榜奖励自动下发至房主账号。
                </p>
                <p>
                    4.
                    本周周星礼物：麦克风（33金币）、告白之声（299金币）、极速闪电（1000金币）
                </p>
                <div className="rule__h1">奖励：</div>
                <p className="redd"> 高光榜：</p>
                <p>TOP1：靓号积分*2000、高光周星头像框*7天</p>
                <p className="redd"> 守护榜：</p>
                <p>TOP1：靓号积分*2000、守护周星头像框*7天</p>
                <p className="redd"> 房间榜：</p>
                <p>TOP1：靓号积分*2000、人气周星头像框*7天</p>
                <div className="div_warp">
                    <div className="div_one">
                        <p className="gao_img">
                            <img src={imgUrl + '/weekStar/gao.png'} alt="" />
                        </p>
                        <p className="div_one_text">高光周星头像框</p>
                    </div>
                    <div className="div_one">
                        <p className="gao_img">
                            <img src={imgUrl + '/weekStar/show.png'} alt="" />
                        </p>
                        <p className="div_one_text">守护周星头像框</p>
                    </div>
                    <div className="div_one">
                        <p className="gao_img">
                            <img src={imgUrl + '/weekStar/ren.png'} alt="" />
                        </p>
                        <p className="div_one_text">人气周星头像框</p>
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

    let divContent = null;
    let liContent = null;
    if (rankData && rankData.list.length === 0) {
        liContent = <li className="li__nodata">暂无数据</li>;
    } else if (rankData && rankData.list.length > 0) {
        liContent =
            rankData &&
            rankData.list.map((item, index) => {
                if (index < 3) {
                    divContent = (
                        <Fragment>
                            <div className="rank__li-pic">
                                <div
                                    className="li-pic"
                                    onClick={
                                        tabKey !== '3'
                                            ? toFunction
                                            : toRoomFunction
                                    }
                                    data-uid={item.uid}
                                >
                                    {item.pic ? (
                                        <img src={item.pic} alt="" />
                                    ) : (
                                        <img src={noImg} alt="" />
                                    )}
                                </div>
                                <div className="rank__li-alias">
                                    <div className="li-alias-div">
                                        {item.name ? item.name : '虚位以待'}
                                    </div>
                                    <div className="li-info-div">
                                        {index === 0
                                            ? '当前' + TAB[tabKey].name + '冠军'
                                            : '距上名' + item.difNum}
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    );
                } else {
                    divContent = (
                        <Fragment>
                            <div className="rank__li-index">{index + 1}</div>
                            <div className="rank__li-info">
                                <div
                                    className="rank__li-pic"
                                    onClick={
                                        tabKey !== '3'
                                            ? toFunction
                                            : toRoomFunction
                                    }
                                    data-uid={item.uid}
                                >
                                    {item.pic ? (
                                        <img src={item.pic} alt="" />
                                    ) : (
                                        <img src={noImg} alt="" />
                                    )}
                                </div>
                                <div className="rank__li-user">
                                    <div className="rank__li-alias">
                                        {item.name ? item.name : '虚位以待'}
                                    </div>
                                </div>
                            </div>
                            <div className="rank__li-prev">
                                <p>距上名差</p>
                                <p>{item.difNum ? item.difNum : '暂无'}</p>
                            </div>
                        </Fragment>
                    );
                }

                return <li key={index}>{divContent}</li>;
            });
    }
    return (
        <Fragment>
            {rankData && (
                <div className="weekstar__rank">
                    <div className="rank__prev">
                        <div
                            className="prev__pic-warp"
                            onClick={
                                tabKey !== '3' ? toFunction : toRoomFunction
                            }
                            data-uid={rankData.prevInfo.uid}
                        >
                            <div className="prev__pic"></div>
                            <img
                                src={
                                    rankData.prevInfo.pic
                                        ? rankData.prevInfo.pic
                                        : noImg
                                }
                                alt=""
                            />
                        </div>
                        <div className="prev__info">
                            <div className="prev__alias">
                                {rankData.prevInfo.name
                                    ? rankData.prevInfo.name
                                    : '虚位以待'}
                            </div>
                            <div className="prev__tips">
                                上周周星{TAB[tabKey].name}TOP1
                            </div>
                        </div>
                    </div>
                    <div className="rank__tab">
                        <div className="rank__tab-content">
                            <ul>{liContent}</ul>
                        </div>
                    </div>
                </div>
            )}

            {Object.keys(rankData.userInfo).length > 0 && tabKey !== '3' && (
                <div className="weekstar__my">
                    <div className="rank__li-index">我</div>
                    <div className="rank__li-info">
                        <div className="rank__li-pic">
                            <img src={rankData.userInfo.pic} alt="" />
                        </div>
                        <div className="rank__li-user">
                            <div className="rank__li-alias">
                                {rankData.userInfo.name}
                            </div>
                        </div>
                    </div>
                    <div className="rank__li-prev">
                        {rankData.userInfo.rank > 0
                            ? '距上名差' + rankData.userInfo.diffNum
                            : '距上榜差' + rankData.userInfo.diffNum}
                    </div>
                </div>
            )}
        </Fragment>
    );
};

const RankTemplate = ({ ticket }) => {
    const [showRule, setShowRule] = useState(false);
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
                    // d.content = {
                    //     list: [
                    //         {
                    //             pic: 'https://s1.yuewankeji.top/dev/2023-09-14/20-100ht1694696251720356116.jpg?x-oss-process=image/resize,w_240,h_240',
                    //             name: '小二和',
                    //             rank: 1,
                    //             difNum: '0',
                    //         },
                    //     ],
                    //     userInfo: {
                    //         pic: 'https://s1.yuewankeji.top/dev/2023-09-14/20-100ht1694696251720356116.jpg?x-oss-process=image/resize,w_240,h_240',
                    //         name: '小二和',
                    //         rank: 1,
                    //         difNum: '0',
                    //     },
                    //     prevInfo: {
                    //         pic: 'https://s1.yuewankeji.top/dev/2023-09-14/20-100ht1694696251720356116.jpg?x-oss-process=image/resize,w_240,h_240',
                    //         name: '小二和',
                    //         rank: 1,
                    //         difNum: '0',
                    //     },
                    // };
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
                <div className="weekstar__warp-banner">
                    <div className="rule__icon" onClick={ruleFn}>
                        规则
                    </div>
                    <div className="weekstar__dtime">
                        <CutDown
                            count={info.tm}
                            formatTime={false}
                            formatDay={true}
                        />
                    </div>
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
                                title={<div className="text__tab">高光榜</div>}
                                key="1"
                            >
                                <RankContent
                                    rankData={info}
                                    tabKey={tabKey}
                                ></RankContent>
                            </Tabs.Tab>
                            <Tabs.Tab
                                title={<div className="text__tab">守护榜</div>}
                                key="2"
                            >
                                <RankContent
                                    rankData={info}
                                    tabKey={tabKey}
                                ></RankContent>
                            </Tabs.Tab>
                            <Tabs.Tab
                                title={<div className="text__tab">房间榜</div>}
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
            </Fragment>
        );
    }

    return (
        <div
            className={
                (tabKey === '3'
                    ? 'weekstar__warp weekstar__warp3'
                    : 'weekstar__warp') +
                (searchParam.room === 'full' ? ' week__full' : '')
            }
        >
            {mainContent}
            {showRule && <RuleAlert setShow={setShowRule}></RuleAlert>}
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
