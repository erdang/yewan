import React, { Fragment, useEffect, useCallback, useState } from 'react';
import { PageLoading } from '@/component/PageLoading';
import SvgIcon from '@/component/SvgIcon';
import { getReal, VP, Task_Arr } from '../contant';

import setTitle from '@/utility/settitle';
import user from '@/utility/user';
// import { useNavigate } from 'react-router-dom';
// import useToLogin from '@/hooks/toLogin';
import { appGate } from '@/utility/appGate';
import instance from '@/request/index';

const MyLevel = ({ ticket, userInfo }) => {
    // let { has } = useToLogin(ticket);
    // let navigate = useNavigate();
    const [info, setInfo] = useState('');
    const [real, setReal] = useState('');
    const getInfo = useCallback(() => {
        user.getUser(ticket).then((d) => {
            // d.realcoinrank = '1';
            let real = getReal(Number(d.realcoinrank));
            setReal(real);
            setInfo(d);
        });
    }, [ticket]);

    const getRadomRoom = useCallback(() => {
        return instance.get('/api/label/collection');
    }, []);

    const toTaskFn = useCallback(
        async (event) => {
            let index = Number(event.currentTarget.dataset.type);
            let respone = await getRadomRoom();
            let { uid } =
                respone.content.topRec.length > 0 &&
                respone.content.topRec[
                    Math.round(Math.random() * respone.content.topRec.length)
                ];

            let routeFn = {
                0: {
                    route: 'RoomsViewRoute',
                    options: {
                        uid: uid,
                        nextType: 'giftbox',
                        nextParam: { id: '1' },
                    },
                },
                // 1: {
                //     route: 'RoomsViewRoute',
                //     options: {
                //         uid: uid,
                //         nextType: 'share',
                //     },
                // },
                1: {
                    route: 'RoomsViewRoute',
                    options: {
                        uid: uid,
                    },
                },
                2: {
                    route: 'RootRoute',
                    options: { tabIndex: '3' },
                },
                3: {
                    route: 'RootRoute',
                    options: { tabIndex: '2' },
                },
            };
            appGate.CommonEvent({
                method: 'H5toAppRoute',
                param: routeFn[index],
            });
        },
        [getRadomRoom],
    );

    useEffect(() => {
        setTitle('我的等级');
        getInfo();
    }, [getInfo]);
    let mainContent = null;
    let iconUlContent = null;
    let UlContent = null;

    if (!info) {
        mainContent = <PageLoading />;
    } else {
        let sWidth = (info.coinall / info.coinstep) * 100 + '%';
        iconUlContent = VP.map((item, index) => {
            return (
                <li key={index} className={item.id <= real.vp ? 'active' : ''}>
                    <div
                        className="icon_bg"
                        style={{
                            background: real.icon_bg_color,
                        }}
                    >
                        <div className="svg_warp">
                            <SvgIcon
                                iconClass={item.icon}
                                color={real.task_color}
                            ></SvgIcon>
                        </div>
                    </div>
                    <div className="icon_text">{item.title}</div>
                    <div className="icon_text_1">{item.text}</div>
                </li>
            );
        });
        UlContent = Task_Arr.map((item, index) => {
            return (
                <li key={index}>
                    <div className="li-info">
                        <div
                            className="info-icon-1"
                            style={{
                                background: real.icon_bg_color,
                            }}
                        >
                            <div className="svg_warp">
                                <SvgIcon
                                    iconClass={item.icon}
                                    color={real.task_color}
                                ></SvgIcon>
                            </div>
                        </div>
                        <div className="info-text">
                            <div className="info-text-1">{item.title}</div>
                            <div className="info-text-2">{item.text}</div>
                        </div>
                    </div>
                    <div
                        className="li-text"
                        style={{ background: real.btn_color }}
                        data-type={index}
                        onClick={toTaskFn}
                    >
                        去完成
                    </div>
                </li>
            );
        });
        mainContent = (
            <div className="myLevel">
                <div
                    className="myLevel-top"
                    style={{
                        backgroundImage: 'url(' + real.bg + ')',
                    }}
                >
                    <div
                        className="myLevel-top-bg"
                        style={{
                            backgroundImage: 'url(' + real.k_bg + ')',
                        }}
                    >
                        <div
                            className="my_title"
                            style={{
                                color: real.title_1_color,
                                // WebkitBackgroundClip: 'text',
                                // WebkitTextFillColor: 'transparent',
                            }}
                        >
                            <div>{real.title}</div>
                            <div
                                className="now__text"
                                style={{
                                    background: real.bar_active_color,
                                }}
                            >
                                当前等级
                            </div>
                        </div>
                        <div
                            className="my_title_1"
                            style={{
                                color: real.title_2_color,
                            }}
                        >
                            成长值需达到LV{info.realcoinrank}
                        </div>
                        <div className="my_icon" style={{ display: 'none' }}>
                            <img src={real.k_icon} alt="" />
                        </div>

                        <div className="level-process">
                            <div className="bar">
                                <div className="level-bar">
                                    <div
                                        className="active"
                                        style={{
                                            width: sWidth,
                                            background: real.bar_active_color,
                                        }}
                                    ></div>
                                </div>
                                <div
                                    className="bar-text"
                                    style={{
                                        color: real.title_2_color,
                                    }}
                                >
                                    <span>{info.coinall}</span>
                                    <span>还需{info.nextrank}成长值升级</span>
                                    {Number(info.realcoinrank) <= 30 && (
                                        <span className="jiasu_icon"></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="myLevel-content">
                    <div className="title">
                        <div className="title_left">等级特权</div>
                        <div className="title_right">(已解锁{real.vp}/8)</div>
                    </div>
                    <div className="icon-ul">
                        <ul>{iconUlContent}</ul>
                    </div>
                    <div className="title-2">获取经验值方式</div>
                    <div className="level-ul">
                        <ul>{UlContent}</ul>
                    </div>
                </div>
            </div>
        );
    }

    return <Fragment>{mainContent}</Fragment>;
};

export default MyLevel;
