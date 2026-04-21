import './index.scss';
import React, { useEffect, useState, useCallback, Fragment } from 'react';
import { connect } from 'react-redux';

import DawerOverlay from '@/component/DawerOverlay';
import { PageLoading } from '@/component/PageLoading';
import { Dialog } from 'antd-mobile';
import { MEN } from './contant';

import urlTool from 'ox-util/src/url';
import setTitle from '@/utility/settitle';
import { appGate } from '@/utility/appGate';
import instance from '@/request';
import { format as formatTime } from 'ox-util/src/time';

const searchParam = urlTool.param(window.location.search);

const SecretPage = ({ ticket }) => {
    // let navigate = useNavigate();
    const [info, setInfo] = useState('');

    const getInfo = useCallback(() => {
        instance
            .post('/api/user/getUserInfo', {
                encpass: ticket,
            })
            .then((e) => {
                // e.content.mystery.duration = '1670916462';
                // console.log(new Date().getTime());
                if (e.flag === '001') {
                    setInfo(e.content.mystery);
                }
            });
    }, [ticket]);

    const buyFn = useCallback(() => {
        instance
            .post('/api/mystery/buy', {
                encpass: ticket,
            })
            .then((d) => {
                if (d.code === '200') {
                    Dialog.alert({
                        content: d.content,
                        confirmText: '确定',
                        onConfirm: () => {
                            getInfo();
                        },
                    });
                }
            });
    }, [ticket, getInfo]);

    const putOnFn = useCallback(
        (event) => {
            let kswitch = event.currentTarget.dataset.switch;
            instance
                .post('/api/mystery/settings', {
                    encpass: ticket,
                    switch: kswitch === '0' ? '1' : '0',
                })
                .then((d) => {
                    if (d.code === '200') {
                        Dialog.alert({
                            content: d.content,
                            confirmText: '确定',
                            onConfirm: () => {
                                getInfo();
                            },
                        });
                        appGate.CommonEvent({
                            method: 'secretMenPutFnToapp',
                            param: {
                                key: '',
                                eventName: '',
                            },
                        });
                    }
                });
        },
        [ticket, getInfo],
    );

    useEffect(() => {
        setTitle('神秘人');
        getInfo();
    }, [getInfo]);
    let mainContent = null;
    let liContent = null;

    if (!info) {
        mainContent = <PageLoading />;
    } else {
        liContent = MEN.map((item, index) => {
            return (
                <li key={index}>
                    <div className="g__left">
                        <div className="g__left-title">{item.title}</div>
                        <div className="g__left-text">{item.text}</div>
                    </div>
                    <div className="g__icon">
                        <img src={item.icon} alt="" />
                    </div>
                </li>
            );
        });

        let topContent = {
            0: (
                <div className="top__info">
                    <div className="info__mai">
                        <div className="info__mai-text">
                            <span>9999</span>
                            <span>Z币/7天</span>
                        </div>
                        <div className="info__mai-tip">购买后套餐有效期7天</div>
                    </div>
                    <div className="info__mai-btn" onClick={buyFn}>
                        立即购买
                    </div>
                </div>
            ),

            1: (
                <div className="top__info">
                    <div className="info__mai">
                        <div className="info__mai-text">
                            <span>已拥有</span>
                        </div>
                        <div className="info__mai-tip">
                            有效期至：
                            {formatTime(info.duration * 1000, 'y-m-d')}
                        </div>
                    </div>
                    <div
                        className="put__btn"
                        onClick={putOnFn}
                        data-switch={info.switch}
                    >
                        {info.switch === '1' ? '脱下神秘人' : '穿戴神秘人'}
                    </div>
                </div>
            ),
        };
        mainContent = (
            <Fragment>
                <div className="secret_top">
                    <div className="secret_top_text"></div>
                    <div className="secret_top_info">
                        {topContent[info.isMystery]}
                    </div>
                </div>
                <div className="secret_content">
                    <div className="content_title"></div>
                    <ul>{liContent}</ul>
                    <div className="secret_rule"></div>
                    <div className="content_title-2"></div>
                    <div
                        className={
                            'content_p ' + (info.isMystery === '1' ? 'mar' : '')
                        }
                    >
                        1、穿戴神秘人套装后，为保护你的信息不被显露，我们做了以下策略：
                        <br />
                        1）穿戴或脱下神秘人套装需间隔5分钟以上，减少频繁切换。
                        <br />
                        2）他人无法关注你，但你可以关注他人。由于关注功能不局限于直播间内，，所以当你关注他人时，该用户会收到你关注了ta的私信，私信中展示你的真实身份。请在神秘人期问谨慎使用关注功能。
                        <br />
                        3）你不可以被设置为管理员；你的原身份是管理员时，为保护你的管理员身份
                        不被显露，将暫时不可使用管理员功能。 <br />
                        4） 你不可以开启直播。 <br />
                        5）被关注、管理员、开播功能，仅在穿戴神秘人套装后限制使用，当你脱下神秘人套装后，所有功能恢复正常。
                        <br />
                        6）神秘人期问的看播时长，礼物、亲密关系均会在真实身份下记录。
                        <br />
                        7）榜单及活动中会如若涉及到展示，会展示为神秘人样式及神秘人昵称
                        <br />
                        2、神秘人套装是为了给大家提供更自由良好的体验而设计，穿戴神秘人套装期间的所有行为仍受法律约束，切勿因此发表不当言论、触犯网络安全。
                    </div>
                </div>
                {info.duration - new Date().getTime() / 1000 <= 86400 &&
                    info.isMystery === '1' && (
                        <div className="secret__bottom">
                            <div className="buy__btn" onClick={buyFn}>
                                立即续费
                            </div>
                        </div>
                    )}
            </Fragment>
        );
    }
    return <div className="secret">{mainContent}</div>;
};

var Level = function ({ ticket }) {
    useEffect(() => {
        setTitle('神秘人');
    }, []);

    if (searchParam.room === 'full') {
        return <SecretPage ticket={ticket}></SecretPage>;
    }
    return (
        <DawerOverlay onClose={appGate.closeWeb} className="secret_full">
            <SecretPage ticket={ticket}></SecretPage>
        </DawerOverlay>
    );
};

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(Level);
