import './index.scss';

import React, { useState, useCallback, useEffect } from 'react';
import DawerOverlay from '@/component/DawerOverlay';
import { connect } from 'react-redux';
import CenterOverlay from '@/component/CenterOverlay';
import Portal from '@/component/Protal';
import ComTab from '@/component/comTab';
import urlTool from 'ox-util/src/url';
import setTitle from '@/utility/settitle.js';
import { appGate } from '@/utility/appGate.js';

import instance from '@/request/index';
import { BlockLoading } from '@/component/PageLoading';

const searchParam = urlTool.param(window.location.search);

const RusultAlert = ({ resultList, setShow }) => {
    const closeAlert = useCallback(() => {
        setShow(false);
    }, [setShow]);

    return (
        <Portal>
            <CenterOverlay className="turn-result" onClose={closeAlert}>
                <div className="title">恭喜获得</div>
                <div className="award">
                    <ul>
                        {resultList.map((item, index) => {
                            return (
                                <li key={index}>
                                    <div className="g-icon">
                                        <img
                                            src={item.reward_static_img}
                                            alt=""
                                        />
                                    </div>
                                    <div className="g-text">
                                        {item.reward_format}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="btn__div">
                    <div className="s-btn" onClick={closeAlert}>
                        收下
                    </div>
                </div>
            </CenterOverlay>
        </Portal>
    );
};

const RuleAlert = ({ setShow, info }) => {
    const closeAlert = useCallback(() => {
        setShow(false);
    }, [setShow]);

    return (
        <div className="weekstar-alert">
            <div className="alert__title">
                <div className="back__icon" onClick={closeAlert}>
                    <svg
                        t="1721626117852"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="4436"
                        width="200"
                        height="200"
                    >
                        <path
                            d="M646.981818 889.018182c-9.309091 0-18.618182-2.327273-25.6-9.309091L276.945455 532.945455c-6.981818-6.981818-9.309091-16.290909-9.309091-25.6s4.654545-18.618182 9.309091-25.6L623.709091 137.309091c13.963636-13.963636 34.909091-13.963636 48.872727 0s13.963636 34.909091 0 48.872727L351.418182 507.345455l321.163636 321.163636c13.963636 13.963636 13.963636 34.909091 0 48.872727-6.981818 9.309091-16.290909 11.636364-25.6 11.636364z"
                            p-id="4437"
                        ></path>
                    </svg>
                </div>
                <div className="alert__title-div">活动规则</div>
            </div>
            {/* <div
                className="top__1"
                dangerouslySetInnerHTML={{ __html: info.rule }}
            ></div> */}
            <div className="top__1">
                <pre>{info.rule}</pre>
            </div>
        </div>
    );
};

const RankTemplate = ({ ticket }) => {
    const [showRule, setShowRule] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [resultGift, setResultGift] = useState('');
    const [timeCurrent, setTimeCurrent] = useState(1);
    const [info, setInfo] = useState('');

    const [tabNode, setTabNode] = useState([]);

    const getInfo = useCallback(() => {
        instance
            .post('/api/v1/firstRecharge/lists', {
                token: ticket,
            })
            .then((d) => {
                // d.content.config[0].receive_status = '1';

                setInfo(d.content);

                const tabArr = d.content.config.map((item, index) => {
                    return {
                        title: item.title.substring(2),
                        des: '',
                        key: index + 1,
                    };
                });
                setTabNode(tabArr);
            });
    }, [ticket]);

    const ruleFn = useCallback((key) => {
        setShowRule(true);
    }, []);

    const toPayFn = useCallback(
        (event) => {
            let price = event.currentTarget.dataset.price;

            appGate
                .openToPay({
                    money: price,
                })
                .then((d) => {
                    if (d === '1') {
                        getInfo();
                    }
                });
        },
        [getInfo],
    );

    const timeLineFn = useCallback(
        (event) => {
            let key = Number(event.currentTarget.dataset.key);
            setTimeCurrent(key);
        },
        [setTimeCurrent],
    );

    // const tabContent = {
    //     1:
    // }

    const getFn = useCallback(
        (event) => {
            let taskid = Number(event.currentTarget.dataset.taskid);
            let index = Number(event.currentTarget.dataset.index);
            // setShowResult(true);
            // setResultGift(info.config[1].extra);

            instance
                .post('/api/v1/activity/receiveActivityPackage', {
                    token: ticket,
                    id: taskid,
                    ruid: searchParam.ruid,
                })
                .then((d) => {
                    if (d.code === '200') {
                        getInfo();
                        setShowResult(true);
                        setResultGift(info.config[index].extra);
                    }
                });
        },
        [ticket, getInfo, info],
    );

    useEffect(() => {
        setTitle('首冲有礼');
        getInfo();
    }, [getInfo]);

    let mainContent = null;
    let giftContent = null;

    if (!info) {
        mainContent = <BlockLoading />;
    } else if (info) {
        giftContent = info.config.map((item, index) => {
            let btnStatus = {
                0: (
                    <div
                        className="to__btn"
                        onClick={toPayFn}
                        data-price={item.discount_price}
                    >
                        立刻购买
                        <span>原价:{item.price}元</span>
                    </div>
                ),
                1: (
                    <div
                        className="g__btn"
                        onClick={getFn}
                        data-taskid={item.user_activity_id}
                        data-index={index}
                    >
                        立即领取
                    </div>
                ),
                2: <div className="h__btn">立刻购买</div>,
            };
            return (
                <li key={index}>
                    <div className={'li__title'}>
                        <div className="li__tilte1"></div>
                        <div>{item.title}</div>
                        <div className="li__tilte2"></div>
                    </div>
                    <div className="li__gwarp">
                        {item.extra.map((i, d) => {
                            return (
                                <div key={d} className="li__div">
                                    <div className="g__img">
                                        <img src={i.reward_static_img} alt="" />
                                        <div className="li__rote">
                                            {i.reward_expire_format}
                                        </div>
                                    </div>
                                    <div className="g__title">
                                        {i.reward_format}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {btnStatus[item.receive_status]}
                </li>
            );
        });
        mainContent = (
            <div className="weekstar__warp-1">
                <div className="weekstar__warp-banner">
                    <div className="rule__icon" onClick={ruleFn}>
                        <div className="r__icon"></div>
                        <div className="r__text">规则</div>
                    </div>
                </div>
                <ComTab
                    timeLineFn={timeLineFn}
                    tabNode={tabNode}
                    current={timeCurrent}
                    className={'first__tab'}
                />
                <div className="w__gift">
                    {/* <div className="w__title">遇见天使</div> */}
                    <ul>{giftContent[timeCurrent - 1]}</ul>
                </div>
            </div>
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
            {showRule && (
                <RuleAlert setShow={setShowRule} info={info}></RuleAlert>
            )}
            {showResult && (
                <RusultAlert
                    setShow={setShowResult}
                    resultList={resultGift}
                ></RusultAlert>
            )}
        </div>
    );
};

var WeekStar = function ({ ticket, userInfo }) {
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
