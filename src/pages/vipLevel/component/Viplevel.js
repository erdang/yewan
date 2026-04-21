import React, {
    Fragment,
    useEffect,
    useCallback,
    useState,
    useRef,
} from 'react';
import { PageLoading } from '@/component/PageLoading';
import { Swiper } from 'antd-mobile';

import setTitle from '@/utility/settitle';
import instance from '@/request/index';
import { format as formatTime } from 'ox-util/src/time';
import { appGate } from '@/utility/appGate';
import { VIP_INFO } from './contant';

import urlTool from 'ox-util/src/url';

const searchParam = urlTool.param(window.location.search);

const MyLevel = ({ ticket, userInfo }) => {
    const [info, setInfo] = useState('');
    const [current, setCurrent] = useState(0);
    const currentRef = useRef(0);

    const getInfo = useCallback(() => {
        instance
            .post('/api/user/getVipInfo', {
                encpass: ticket,
            })
            .then((d) => {
                // d.content = {
                //     level: '0', // 当前等级
                //     levelIcon:
                //         'https://vr0.6houses.cn/2022/09/15/20/1014v1663243586614473994.png',
                //     nextLevel: '3', // 下一等级
                //     currentNum: '5000', // 当前值
                //     nextDiffNum: '0', // 距离下一等级还差多少
                //     allNum: '30000', // 总数
                //     isExpire: '0', // 是否过期 1过期 0未过期
                //     expire: '1669880707', // 过期时间 时间戳
                // };
                setCurrent(
                    Number(d.content.level) === 0
                        ? 0
                        : Number(d.content.level) - 1,
                );
                setInfo(d.content);
            });
    }, [ticket]);

    const onIndexChangeFn = useCallback((index) => {
        currentRef.current = index;
        window.setTimeout(() => {
            setCurrent(index);
        }, 500);
    }, []);

    const payFn = useCallback((index) => {
        appGate.openPayPage({ amount: 0, title: '' });
        appGate.CommonEvent({
            method: 'reportEventFromH5',
            param: {
                key: 'key',
                eventName: 'vip_charge',
            },
        });
    }, []);

    useEffect(() => {
        setTitle('我的等级');
        getInfo();
        appGate.CommonEvent({
            method: 'reportEventFromH5',
            param: {
                key: 'key',
                eventName: 'vip_page',
            },
        });
    }, [getInfo]);

    let mainContent = null;

    if (!info) {
        mainContent = <PageLoading />;
    } else {
        let sWidth = (info.currentNum / info.allNum) * 100 + '%';
        let nowArr =
            info.level === '0'
                ? Object.values(VIP_INFO)
                : Object.values(VIP_INFO).splice(1);
        let nowText = '';
        let noVipContent = '';

        const verticalItems = nowArr.map((item, index) => {
            if (item.level > Number(info.level)) {
                nowText = '未达成';
            } else if (item.level === Number(info.level)) {
                nowText = '当前等级';
            } else if (item.level < Number(info.level)) {
                nowText = '已达成';
            }
            if (info.level === '0') {
                noVipContent = (
                    <Fragment>
                        <div
                            className={
                                'name_text_com ' + ('name_text_' + index)
                            }
                        >
                            VIP{index !== 0 && item.level}
                        </div>
                        <div
                            className={'num_text_com ' + ('num_text_' + index)}
                        >
                            {index === 0 ? (
                                <Fragment>
                                    距离VIP
                                    {info.nextLevel}会员还需要
                                    {info.nextDiffNum}元
                                </Fragment>
                            ) : (
                                '充值达到' + item.num + '元可升级'
                            )}
                        </div>
                        {index === 0 && (
                            <div className={'bar_com ' + ('bar_' + index)}>
                                <div className="level-bar">
                                    <div
                                        className="active"
                                        style={{
                                            width: sWidth,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <div
                            className={
                                'info_text_com ' + ('info_text_' + index)
                            }
                        >
                            立即解锁享受特权
                        </div>
                        <div
                            className={'info_btn_com ' + ('info_btn_' + index)}
                            onClick={payFn}
                        >
                            去解锁
                        </div>
                    </Fragment>
                );
            } else {
                if (index === info.level - 1) {
                    noVipContent = (
                        <Fragment>
                            <div
                                className={
                                    'name_text_com ' + ('newname_text_' + index)
                                }
                            >
                                VIP{item.level}
                            </div>
                            <div
                                className={
                                    'num_text_com ' + ('newnum_text_' + index)
                                }
                            >
                                <span className="now_num">
                                    {info.currentNum}
                                </span>
                                {info.nextDiffNum > 0 ? (
                                    <Fragment>
                                        距离VIP
                                        {info.nextLevel}会员还需要
                                        {info.nextDiffNum}元
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        保持VIP
                                        {info.level}会员还需要
                                        {info.nextDiffNum}元
                                    </Fragment>
                                )}
                            </div>
                            <div className={'bar_com ' + ('newbar_' + index)}>
                                <div className="level-bar">
                                    <div
                                        className="active"
                                        style={{
                                            width: sWidth,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div
                                className={
                                    'new_date_com ' + ('new_date_' + index)
                                }
                            >
                                有效期至
                                <span>
                                    {formatTime(info.expire * 1000, 'y-m-d')}
                                </span>
                            </div>
                        </Fragment>
                    );
                } else if (index < info.level - 1) {
                    noVipContent = (
                        <Fragment>
                            <div
                                className={
                                    'name_text_com ' + ('newname_text_' + index)
                                }
                            >
                                VIP{item.level}
                            </div>
                            <div
                                className={
                                    'num_text_com ' + ('newnum_text_' + index)
                                }
                            >
                                当前高于该等级
                            </div>
                        </Fragment>
                    );
                } else if (index > info.level - 1) {
                    noVipContent = (
                        <Fragment>
                            <div
                                className={
                                    'name_text_com ' + ('newname_text_' + index)
                                }
                            >
                                VIP{item.level}
                            </div>
                            <div
                                className={
                                    'num_text_com ' + ('newnum_text_' + index)
                                }
                            >
                                充值达到{item.num}元可升级
                            </div>
                            <div
                                className={
                                    'info_btn_com ' + ('newinfo_btn_' + index)
                                }
                                onClick={payFn}
                            >
                                去升级
                            </div>
                        </Fragment>
                    );
                }
            }
            return (
                <Swiper.Item key={index}>
                    <div
                        className="verticalContent"
                        style={{
                            backgroundImage: 'url(' + item.levelIcon + ')',
                        }}
                    >
                        <div
                            className={
                                'now_text_com ' +
                                ((info.level === '0'
                                    ? 'now_text_'
                                    : 'new_text_') +
                                    index)
                            }
                        >
                            {nowText}
                        </div>
                        {noVipContent}
                    </div>
                </Swiper.Item>
            );
        });

        const iconContent = nowArr[current].privileged_arr.map(
            (item, index) => {
                return (
                    <div key={index} className="icon_li">
                        <div className="icon_li-img">
                            <img src={item.icon} alt="" />
                        </div>
                        <div className={'icon_li-name'}>{item.name}</div>
                    </div>
                );
            },
        );

        mainContent = (
            <div
                className={
                    'myLevel ' +
                    (searchParam.room === 'full' ? 'myLevel_full' : '')
                }
            >
                <div
                    className={
                        'top_c ' +
                        ((info.level === '0' ? 'top_r_' : 'top_a_') + current)
                    }
                ></div>
                <div className="myLevel-top">
                    <div className="banner-swiper">
                        <Swiper
                            defaultIndex={current}
                            slideSize={92}
                            trackOffset={5}
                            stuckAtBoundary={false}
                            onIndexChange={onIndexChangeFn}
                        >
                            {verticalItems}
                        </Swiper>
                    </div>
                </div>
                <div className="myLevel-content">
                    <div
                        className={
                            'content_bg_c ' +
                            (info.level === '0'
                                ? 'content_bg' + current
                                : 'newcontent_bg' + current)
                        }
                    >
                        <div className="content_title"></div>
                        <div className="title_tip">{nowArr[current].tips}</div>
                        <div className="icon_div"> {iconContent}</div>
                    </div>
                </div>
                {info.isExpire === '1' && (
                    <div className="g_bg">
                        <div className="text">{'VIP' + info.level}</div>
                        <div className="lock"></div>
                        <div className="text2">
                            <span>{info.currentNum}</span>
                            {info.nextDiffNum}值解锁
                        </div>
                        <div className="text3">
                            {'充值达标即可想享受VIP' + info.level + '特权'}
                        </div>
                        <div
                            className={'text-btn_' + info.level}
                            onClick={payFn}
                        >
                            去充值
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return <Fragment>{mainContent}</Fragment>;
};

export default MyLevel;
