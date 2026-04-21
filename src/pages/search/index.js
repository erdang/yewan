import './index.scss';

import React, { Fragment, useEffect, useCallback, useState } from 'react';
import { BadgeIcon } from '../../component/BadgeIcon';
import { connect } from 'react-redux';
import { PageLoading } from '../../component/PageLoading';

import setTitle from '../../utility/settitle';
import user from '../../utility/user';
import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;
const money = APPNAME[hostname].money;

const MyLevel = ({ ticket, userInfo }) => {
    const [info, setInfo] = useState('');
    const getInfo = useCallback(() => {
        user.getUser(ticket).then((d) => {
            setInfo(d);
        });
    }, [ticket]);
    useEffect(() => {
        setTitle('我的等级');
        getInfo();
    }, [getInfo]);
    let mainContent = null;
    let sexIcon = {
        1: <span className="icon-sex-men"></span>,
        2: <span className="icon-sex-nv"></span>,
    };

    if (!info) {
        mainContent = <PageLoading />;
    } else {
        let sWidth = (info.coinall / info.coinstep) * 100 + '%';

        mainContent = (
            <div className="myLevel">
                <div className="myLevel-top">
                    <div className="level-info">
                        <div className="spic">
                            <img src={info.picuser} alt="" />
                        </div>
                        <div className="user-div">
                            <div className="alias">
                                <span className="alias-span">{info.alias}</span>
                                {sexIcon[info.sex]}
                            </div>
                            <div className="level-num">
                                当前等级LV.{info.coinrank}
                            </div>
                        </div>
                    </div>
                    <div className="level-process">
                        <div className="prev-level">
                            <BadgeIcon level={info.coinrank} />
                        </div>
                        <div className="bar">
                            <div className="level-bar">
                                <div
                                    className="active"
                                    style={{
                                        width: sWidth,
                                    }}
                                ></div>
                            </div>
                            <div className="bar-text">
                                升级还需{info.nextrank}
                                {money}
                            </div>
                        </div>
                        <div className="next-level">
                            <BadgeIcon level={Number(info.coinrank) + 1} />
                        </div>
                    </div>
                    <div className="myLevel-content">
                        <div className="title">如何升级</div>
                        <div className="level-ul">
                            <ul>
                                <li>
                                    <div className="li-info">
                                        <div className="info-icon-1"></div>
                                        <div className="info-text">
                                            房间礼物互动
                                        </div>
                                    </div>
                                    <div className="li-text">
                                        1{money}=1财富值
                                    </div>
                                </li>
                                <li>
                                    <div className="li-info">
                                        <div className="info-icon-2"></div>
                                        <div className="info-text">
                                            完成任务
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="myLevel-more">
                    <div className="no-more">
                        <div className="no-more-icon1"></div>
                        <div className="no-more-text">更多活动敬请期待</div>
                    </div>
                </div>
            </div>
        );
    }

    return <Fragment>{mainContent}</Fragment>;
};

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(MyLevel);
