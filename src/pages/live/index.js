import './index.scss';
import React, {
    useEffect,
    useCallback,
    useState,
    Fragment,
    useRef,
    createElement,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { PageLoading } from '@/component/PageLoading';
import { Button, Dialog } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import { BadgeIcon } from '@/component/BadgeIcon';

import setTitle from '@/utility/settitle';
import instance from '@/request/index';
import roomWebSocket from '@/utility/socket/roomWebsocket';
import user from '@/utility/user.js';
import { APPNAME } from '@/utility/appName';
import AgoraSdk from '@/utility/agorasdk';
// import VConsole from 'vconsole';
// /*eslint-disable*/
// const vConsole = new VConsole();

const hostname = window.location.hostname;
const appId = '35a56de705f042b1b23664eebd3ec5c7';

const IMG_URL = APPNAME[hostname].staticUrl + '/room/';

// const RESET_SOUND_LIST = new Array(8).fill({
//     picuser: IMG_URL + 'mai_1.png',
//     seat: '0',
//     charm: '0',
//     sound: 0,
// });
const stripHtml = function (str) {
    return str.replace(/<[^>]*?>/g, '');
};

const NUM_IMG = {
    0: IMG_URL + '0.png',
    1: IMG_URL + '1.png',
    2: IMG_URL + '2.png',
    3: IMG_URL + '3.png',
    4: IMG_URL + '4.png',
    5: IMG_URL + '5.png',
    6: IMG_URL + '6.png',
    7: IMG_URL + '7.png',
    8: IMG_URL + '8.png',
    9: IMG_URL + '9.png',
};

// 905 麦序 906 volume>0 显示声波
// 123 欢迎消息  101 公聊 102 系统消息  201 送礼
const ChatContent = ({ gift, info }) => {
    const [welInfo, setWelInfo] = useState([]);
    const [giftInfo, setGiftInfo] = useState([]);
    const [chatArr, setChatArr] = useState([]);
    let chatData = useRef([]);
    let messagesEnd = useRef(null);
    let timer1 = useRef(null);
    const scrollToBottom = () => {
        if (messagesEnd && messagesEnd.current) {
            messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const pushData = useCallback((data) => {
        chatData.current = chatData.current.concat(data);
        timer1.current = setTimeout(() => {
            scrollToBottom();
        }, 100);

        if (chatData.current.length > 50) {
            chatData.current.shift();
        }
    }, []);

    const receive101Fn = useCallback(
        (s) => {
            console.log(s);
            pushData(s);
            setChatArr([...chatData.current]);
        },
        [pushData],
    );

    const receive102Fn = useCallback(
        (s) => {
            // console.log(s);
            pushData(s);
            setChatArr([...chatData.current]);
        },
        [pushData],
    );
    const receive201Fn = useCallback(
        (s) => {
            console.log(s);
            pushData(s);
            setChatArr([...chatData.current]);
            let arr = [];
            arr.push(s);
            setGiftInfo(arr);
        },
        [pushData],
    );

    const receive123Fn = useCallback((s) => {
        // console.log(s);
        let arr = [];
        s.content.msg = stripHtml(s.content.msg);
        if (s.content.msg) {
            arr.push(stripHtml(s.content.msg));
            setWelInfo(arr);
        }
    }, []);

    const initFn = useCallback(() => {
        chatData.current = [...info.sysMsg];
        setChatArr([...chatData.current]);
        timer1.current = setTimeout(() => {
            scrollToBottom();
        }, 100);
    }, [info]);

    const downFn = useCallback(() => {
        Dialog.alert({
            content: '更多功能请下载APP体验吧！',
            confirmText: '确定',
            onConfirm: () => {},
        });
    }, []);

    useEffect(() => {
        roomWebSocket.on('receive:101', receive101Fn);
        roomWebSocket.on('receive:123', receive123Fn);
        roomWebSocket.on('receive:102', receive102Fn);
        roomWebSocket.on('receive:201', receive201Fn);
    }, [receive101Fn, receive123Fn, receive102Fn, receive201Fn]);

    useEffect(() => {
        initFn();
        return () => {
            if (timer1.current) {
                clearTimeout(timer1.current);
            }
            if (chatData.current) {
                chatData.current = [];
            }
        };
    }, [initFn]);

    let chatList = null;

    chatList = chatArr.map((item, index) => {
        let giftName =
            item.content.item &&
            gift.filter((i) => {
                return i.id === item.content.item;
            });
        let listContent = {
            101: (
                <div className="li__warp">
                    <div className="li__pic">
                        <img src={item.headPic} alt="" />
                    </div>
                    <div className="li__info">
                        <div className="li__info-user">
                            <div className="now__level">
                                <BadgeIcon level={Number(item.cr)} />
                            </div>
                            <div className="info__user-alias">{item.from}</div>
                            {item.to && (
                                <div className="info__user-alias">
                                    <span>对</span>
                                    {item.to}
                                </div>
                            )}
                        </div>
                        <div className="list__info-text">{item.content}</div>
                    </div>
                </div>
            ),
            102: <div className="li__102">{item.content}</div>,
            201: (
                <div className="li__201">
                    <div className="li__pic">
                        <img src={item.byPic} alt="" />
                    </div>
                    <div className="li__info">
                        <div className="li__info-user">
                            <div className="now__level">
                                <BadgeIcon level={Number(item.coin6Rank)} />
                            </div>
                            <div className="info__user-alias">
                                {item.byName}
                            </div>
                        </div>
                        <div className="list__info-text">
                            赠送
                            <span className="g__yellow">{item.to}</span>
                            {item.content.num}个
                            <span className="g__yellow">
                                {giftName && giftName[0].title}
                            </span>
                            <span className="g__pic">
                                <img
                                    src={giftName && giftName[0].mpic.img}
                                    alt=""
                                />
                            </span>
                        </div>
                    </div>
                </div>
            ),
        };
        return <li key={index}>{listContent[item.typeID]}</li>;
    });

    return (
        <div className="chat__warp">
            <div className="chat__welcome">
                <QueueAnim
                    className="demo-content"
                    delay={300}
                    onEnd={() => {
                        setWelInfo([]);
                    }}
                >
                    {welInfo.map((item, index) => {
                        return createElement('div', { key: index }, item);
                    })}
                </QueueAnim>
            </div>
            <div className="chat__list">
                <ul>
                    {chatList}
                    <li className="sc__li" ref={messagesEnd}></li>
                </ul>
                <div className="chat__gift">
                    <QueueAnim
                        className="demo-content"
                        delay={300}
                        duration={1000}
                        onEnd={() => {
                            setGiftInfo([]);
                        }}
                    >
                        {giftInfo.map((item, index) => {
                            let giftName =
                                item.content.item &&
                                gift.filter((i) => {
                                    return i.id === item.content.item;
                                });
                            return createElement(
                                'div',
                                { key: index, className: 'chat__gift-li' },
                                createElement(
                                    'div',
                                    { className: 'gift__li-warp' },
                                    createElement(
                                        'div',
                                        { className: 'li__warp-pic' },
                                        createElement('img', {
                                            src: item.byPic,
                                        }),
                                    ),
                                    createElement(
                                        'div',
                                        { className: 'li__warp-user' },
                                        createElement(
                                            'div',
                                            {
                                                className: 'warp__user-form',
                                            },
                                            item.byName,
                                        ),
                                        createElement(
                                            'div',
                                            {
                                                className: 'warp__user-to',
                                            },
                                            createElement(
                                                'span',
                                                { className: '' },
                                                '送给',
                                            ),
                                            createElement(
                                                'span',
                                                { className: '' },
                                                item.to,
                                            ),
                                        ),
                                    ),
                                    createElement(
                                        'div',
                                        {
                                            className: 'warp__gift',
                                        },
                                        createElement(
                                            'div',
                                            { className: 'warp__gift-pic' },
                                            createElement('img', {
                                                src:
                                                    giftName &&
                                                    giftName[0].mpic.img,
                                            }),
                                        ),
                                        createElement(
                                            'div',
                                            { className: 'warp__gift-num' },
                                            createElement('div', {
                                                className: 'gift__num-icon1',
                                            }),
                                            createElement(
                                                'div',
                                                {
                                                    className:
                                                        'gift__num-icon2',
                                                },
                                                item.content.num
                                                    .split('')
                                                    .map((v, d) => {
                                                        return (
                                                            <span key={d}>
                                                                <img
                                                                    src={
                                                                        NUM_IMG[
                                                                            v
                                                                        ]
                                                                    }
                                                                    alt=""
                                                                />
                                                            </span>
                                                        );
                                                    }),
                                            ),
                                        ),
                                    ),
                                ),
                            );
                        })}
                    </QueueAnim>
                </div>
            </div>
            <div className="chat__form" onClick={downFn}>
                <div className="chat__form-input">聊聊吧</div>
                <div className="chat__form-emo"></div>
                <div className="chat__form-mail"></div>
                <div className="chat__form-lian"></div>
                <div className="chat__form-g"></div>
                <div className="chat__form-more"></div>
            </div>
        </div>
    );
};

const RoomShare = ({ ticket, userInfo, gift }) => {
    let navigate = useNavigate();
    let [info, setInfo] = useState('');
    let [soundList, setSoundList] = useState(() => {
        return new Array(8).fill({
            picuser: IMG_URL + 'mai_1.png',
            seat: '0',
            charm: '0',
            sound: 0,
        });
    });
    let [seat99Info, setSeat99Info] = useState('');
    let [seat99show, setSeat99show] = useState(false);
    let [showListenBtn, setShowListenBtn] = useState(false);

    let { roomId } = useParams();

    let realSoundList = useRef(
        new Array(8).fill({
            picuser: IMG_URL + 'mai_1.png',
            seat: '0',
            charm: '0',
            sound: 0,
        }),
    );

    const getInfo = useCallback(() => {
        instance
            .post('/api/room/inroom', {
                ruid: roomId,
            })
            .then((data) => {
                setInfo(data.content);
                let seat99Data = data.content.soundList.filter((i) => {
                    return i.seat === '99';
                });
                let seatSoundData = data.content.soundList.filter((i) => {
                    return i.seat !== '99';
                });
                if (seatSoundData.length > 0) {
                    realSoundList.current.map((i, index) => {
                        if (seatSoundData[index]) {
                            let a = Number(seatSoundData[index].seat) - 1;
                            realSoundList.current[a] = seatSoundData[index];
                        }
                    });
                    setSoundList(realSoundList.current);
                }

                let seat99Object =
                    seat99Data.length > 0
                        ? seat99Data[0]
                        : {
                              picuser: IMG_URL + 'mai_1.png',
                              seat: '0',
                              charm: '0',
                          };
                setSeat99Info(seat99Object);
            });
    }, [roomId]);

    let socketInit = useCallback(() => {
        roomWebSocket.login({
            data: {
                uid: userInfo.id ? userInfo.id : userInfo.guestID,
                encpass: ticket ? ticket : '',
                roomid: roomId,
            },
        });
        roomWebSocket.on('login.success', () => {
            roomWebSocket.sendMsg('priv_info', {
                encpass: ticket || '',
            });
        });
        roomWebSocket.sendMsg('voice_getchannelkey');
        roomWebSocket.on('error', (e) => {
            console.log(e);
        });
        roomWebSocket.on('close', ({ code }) => {
            if (code === 1006) {
                user.toLogin();
            }
        });
    }, [ticket, userInfo, roomId]);

    const receive906Fn = useCallback((s) => {
        //console.log(s);
        let seat99 = s.content.filter((i) => {
            return i.seat === '99';
        });
        let seatList = s.content.filter((i) => {
            return i.seat !== '99';
        });
        realSoundList.current.map((i, index) => {
            if (seatList[index]) {
                let a = Number(seatList[index].seat) - 1;

                realSoundList.current[a].seatshow =
                    seatList[index].volume === '1';
                //console.log(realSoundList.current[a].seatshow);
            }
        });

        let seat99Object =
            seat99.length > 0
                ? seat99[0]
                : {
                      volume: '0',
                  };
        setSeat99show(seat99Object.volume === '1' ? true : false);
        setSoundList([...realSoundList.current]);
    }, []);

    const receive905Fn = useCallback((s) => {
        realSoundList.current = new Array(8).fill({
            picuser: IMG_URL + 'mai_1.png',
            seat: '0',
            charm: '0',
            sound: 0,
        });
        setSeat99Info(
            Object.keys(s.compere).length > 0
                ? s.compere
                : {
                      picuser: IMG_URL + 'mai_1.png',
                      seat: '0',
                      charm: '0',
                  },
        );
        let seatSoundData = s.content;
        realSoundList.current.map((i, index) => {
            if (seatSoundData[index]) {
                let a = Number(seatSoundData[index].seat) - 1;
                realSoundList.current[a] = seatSoundData[index];
            }
        });
        setSoundList(realSoundList.current);
    }, []);

    useEffect(() => {
        getInfo();
        if (!ticket || ticket === 'null') {
            user.toLogin();
        } else {
            socketInit();
        }
        return () => {
            roomWebSocket.close();
            if (realSoundList.current) {
                realSoundList.current = [];
            }
        };
    }, [getInfo, socketInit, ticket]);

    useEffect(() => {
        info && setTitle(info.liveinfo.title);
        AgoraSdk.init();
    }, [info]);

    const receive701Fn = useCallback(async (s) => {
        await AgoraSdk.leaveFn();
        await AgoraSdk.joinFn({
            appId,
            channel: s.content.content.channel,
            token: s.content.content.channelKey,
            uid: Number(s.content.content.uid),
        });
        AgoraSdk.AgoraRTC.onAutoplayFailed = () => {
            setShowListenBtn(true);
        };

        setShowListenBtn(true);
    }, []);

    useEffect(() => {
        roomWebSocket.on('receive:906', receive906Fn);
        roomWebSocket.on('receive:905', receive905Fn);
        roomWebSocket.on('receive:701', receive701Fn);
        return () => {
            AgoraSdk.leaveFn();
        };
    }, [receive906Fn, receive905Fn, receive701Fn]);

    const palyFn = useCallback(() => {
        AgoraSdk.localAudioTrack && AgoraSdk.localAudioTrack.play();
        setShowListenBtn(false);
    }, []);

    let seatContent = null;
    seatContent = soundList.map((item, index) => {
        return (
            <li key={index}>
                <div className="sound__crl">
                    {item.seatshow && (
                        <Fragment>
                            <div className="crl__1"></div>
                            <div className="crl__2"></div>
                        </Fragment>
                    )}

                    <div className="sound__seat99-pic">
                        <img src={item.picuser} alt="" />
                    </div>
                </div>

                {item.seat != '0' ? (
                    <div className="sound__seat99-info">
                        <div className="seat99__info">
                            <span className="seat99__info-alias">
                                {item.alias}
                            </span>
                        </div>
                        <div className="sound__seat99-heat">
                            <span className="heart__icon"></span>
                            <span className="heart__num">
                                {item.charm > 10000
                                    ? (item.charm / 10000).toFixed(2) + 'w'
                                    : item.charm}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="sound__seat99-role">{index + 1}</div>
                )}
            </li>
        );
    });
    let mainContent = null;

    if (!info) {
        mainContent = <PageLoading />;
    } else if (info) {
        mainContent = (
            <Fragment>
                <div
                    className="room_bg"
                    style={{
                        background:
                            'url(' + info.background.app + ') no-repeat',
                        backgroundSize: '100% 100%',
                    }}
                >
                    <div className="room__bg-mask">
                        <div className="room__header">
                            <div className="header__userinfo">
                                <div className="user__pic">
                                    <img
                                        src={info.roominfo.uoption.picuser}
                                        alt=""
                                    />
                                </div>
                                <div className="user__info">
                                    <div className="user__alias">
                                        {info.roominfo.alias}
                                    </div>
                                    <div className="user__num">
                                        <span className="num__icon"></span>
                                        <span className="num__text">
                                            {info.heatNum}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="room__close"
                                onClick={() => {
                                    navigate('/home');
                                }}
                            >
                                <svg
                                    t="1640157205353"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="2054"
                                    width="200"
                                    height="200"
                                >
                                    <path
                                        d="M585.412525 512.594747L973.601616 124.418586c19.600808-19.600808 19.600808-51.898182 0-71.49899l-2.120404-2.120404c-19.600808-19.600808-51.898182-19.600808-71.49899 0L511.793131 439.518384 123.61697 50.799192c-19.600808-19.600808-51.898182-19.600808-71.49899 0l-2.120404 2.120404c-20.11798 19.600808-20.11798 51.898182 0 71.49899l388.189091 388.189091L49.997576 900.783838c-19.587879 19.600808-19.587879 51.898182 0 71.49899l2.120404 2.120404c19.600808 19.600808 51.898182 19.600808 71.49899 0L511.793131 586.214141l388.189091 388.176162c19.600808 19.600808 51.898182 19.600808 71.49899 0l2.120404-2.120404c19.600808-19.600808 19.600808-51.898182 0-71.49899L585.412525 512.594747z m0 0"
                                        p-id="2055"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <div className="room__sound">
                            <div className="sound__seat99">
                                <div className="sound__crl">
                                    {seat99show && (
                                        <Fragment>
                                            <div className="crl__1"></div>
                                            <div className="crl__2"></div>
                                        </Fragment>
                                    )}

                                    <div className="sound__seat99-pic">
                                        <img src={seat99Info.picuser} alt="" />
                                    </div>
                                </div>

                                {seat99Info.seat != '0' ? (
                                    <div className="sound__seat99-info">
                                        <div className="seat99__info">
                                            <span className="seat99__info-alias">
                                                {seat99Info.alias}
                                            </span>
                                            <span className="seat99__info-role"></span>
                                        </div>
                                        <div className="sound__seat99-heat">
                                            <span className="heart__icon"></span>
                                            <span className="heart__num">
                                                {seat99Info.charm > 10000
                                                    ? (
                                                          seat99Info.charm /
                                                          10000
                                                      ).toFixed(2) + 'w'
                                                    : seat99Info.charm}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="sound__seat99-role">
                                        主持
                                    </div>
                                )}
                            </div>
                            <ul className="seatSound">{seatContent}</ul>
                        </div>
                        {showListenBtn && (
                            <div className="listen__btn">
                                <Button
                                    block
                                    type="button"
                                    color="primary"
                                    className="c-button"
                                    onClick={palyFn}
                                >
                                    立即收听
                                </Button>
                            </div>
                        )}
                        <ChatContent gift={gift} info={info} />
                    </div>
                </div>
            </Fragment>
        );
    }

    return <div className="room">{mainContent}</div>;
};

const mapStateTpProps = (state) => {
    return { ...state.user, ...state.gift };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(RoomShare);
