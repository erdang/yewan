import './index.scss';

import React, { useEffect, Fragment, useState, useCallback } from 'react';
import { connect } from 'react-redux';

import DawerOverlay from '@/component/DawerOverlay';
import { PageLoading } from '@/component/PageLoading';

import setTitle from '@/utility/settitle';
import { appGate } from '@/utility/appGate';
import instance from '@/request/index';
import urlTool from 'ox-util/src/url';

const searchParam = urlTool.param(window.location.search);

const BlindBox = ({ ticket }) => {
    const [info, setInfo] = useState('');

    const getLog = useCallback(() => {
        instance
            .get('/api/v1/blindBox/index', {
                params: {
                    token: ticket,
                    type: 2,
                },
            })
            .then((s) => {
                setInfo(s.content);
            });
    }, [ticket]);

    let bContent =
        info &&
        info.list.map((i, d) => {
            return (
                <div className="blind__content" key={d}>
                    <div className="top__title">{i.name}</div>
                    <div className="top__tips">
                        {i.msg}
                        <br />
                        可随机开出以下礼物
                    </div>
                    <div className="blind__gift">
                        <ul>
                            {i.con.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <div className="li__gift">
                                            <img src={item.img} alt="" />
                                        </div>
                                        <div className="li__gift-price">
                                            <div className="li__gift-icon1"></div>
                                            <div className="li__gift-text">
                                                {item.price}
                                            </div>
                                        </div>
                                        <div className="li__gift-name">
                                            {item.title}
                                        </div>
                                        <div className="li__gift-num">
                                            {item.rate}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            );
        });

    useEffect(() => {
        getLog();
    }, [getLog]);

    let mainContent = null;
    if (!info) {
        mainContent = <PageLoading></PageLoading>;
    } else if (info) {
        mainContent = (
            <div className="blind__bg">
                <div className="top__box"></div>
                <div className="top__title"></div>
                {bContent}
                <div className="rule-content">
                    <p className="r-title">注意事项</p>
                    <p>
                        ①.该活动玩法是提升用户房间语聊互动体验的功能，仅供娱乐交流使用。用户获得的奖励不得反向兑换成现金或有价值商品;本活动仅限18岁以上用户参加
                    </p>
                    <p>
                        ②.平台禁止将通过活动中获得的奖励进行线上线下交易，平台严厉打击以盈利为目的的礼物交易行为，通过非正当渠道获取礼物的用户需自行承担不利后果;
                    </p>
                    <p>
                        ③.任何影响互动公平性的用户及利用平台进行违法违规活动的用户，官方有权取消其参与本活动的资格，并回收违规账号非法获得的奖励情节严重者，平台有权追究相关法律责任;
                    </p>
                    <p>
                        ④.消费中请注意保管好账号、密码、短信验证号码等登录操作凭证，谨防上当受骗;
                    </p>
                    <p>
                        ⑤.本活动与苹果公司无关，请理性消费，适度娱乐。玩法最终解释权归平台所有。
                    </p>
                    <p>
                        ⑥.如有疑问，可关注公众号或端内【人工客服】咨询了解详情。
                    </p>
                </div>
            </div>
        );
    }
    return <Fragment>{mainContent}</Fragment>;
};

var BlindBoxPage = function ({ ticket }) {
    useEffect(() => {
        setTitle('盲盒');
    }, []);

    if (searchParam.room === 'full') {
        return (
            <div className="blind-box full">
                <BlindBox ticket={ticket} />
            </div>
        );
    }
    return (
        <DawerOverlay onClose={appGate.closeWeb} className="blind-box">
            <BlindBox ticket={ticket} />
        </DawerOverlay>
    );
};
function mapStateTpProps(state) {
    return { ...state.user };
}

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(BlindBoxPage);
