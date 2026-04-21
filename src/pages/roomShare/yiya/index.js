import './index.scss';

import React, {
    useEffect,
    useCallback,
    useState,
    Fragment,
    useRef,
} from 'react';
import { useParams } from 'react-router-dom';
import { PageLoading } from '@/component/PageLoading';
import { BadgeIcon } from '@/component/BadgeIcon';
import openInstall from '@/utility/openinstall';
import urlTool from 'ox-util/src/url';

import setTitle from '@/utility/settitle';
import instance from '@/request/index';

const searchParam = urlTool.param(window.location.search);
const TopContent = (props) => {
    const { pospic, msg, num, downFn } = props;

    return (
        <div className="top-share">
            <div className="pop-pic">
                <img src={pospic} alt="" />
            </div>
            <div className="top-bg">
                <div className="title">{msg}</div>
                <div className="info">{num}人正在热聊...</div>
                <div className="btn" onClick={downFn}>
                    立即加入
                </div>
            </div>
        </div>
    );
};

const DownList = (props) => {
    const { list, downFn } = props;

    const listContent = list.map((item, index) => {
        return (
            <li key={index}>
                <div className="list-info">
                    <div className="list-pic">
                        <img src={item.picuser} alt="" />
                    </div>
                    <div className="list-user">
                        <div className="list-alias">{item.alias}</div>
                        <div className="list-icon">
                            <BadgeIcon level={item.coinrank} />
                        </div>
                    </div>
                </div>
                <div className="list-btn" onClick={downFn}></div>
            </li>
        );
    });

    return (
        <div className="down-list">
            <div className="down-list-title">他们正在交友</div>
            <ul>{listContent}</ul>
        </div>
    );
};

const RoomShare = () => {
    let [appUser, setAppUser] = useState({});

    let { roomId } = useParams();

    const getInfo = useCallback(() => {
        instance
            .post('/api/user/shareContents', {
                ruid: roomId,
            })
            .then((data) => {
                setAppUser(data.content);
            });
    }, [roomId]);

    const downFn = useCallback(() => {
        if (openInstallRef.current) {
            openInstallRef.current.wakeupOrInstall();
        }
    }, []);

    var openInstallRef = useRef(null);

    useEffect(() => {
        openInstall({
            channelCode: '8888',
            extraParam: {
                params: {
                    route: 'RoomsViewRoute',
                    param: {
                        uid: roomId,
                        nextType: searchParam.nextType,
                        nextParam: {
                            seat: searchParam.seat,
                        },
                    },
                },
            },
        }).then((oi) => {
            openInstallRef.current = oi;
            // oi.schemeWakeup();
        });
    }, [roomId]);

    useEffect(() => {
        getInfo();
    }, [getInfo]);

    useEffect(() => {
        setTitle(appUser.msg);
    }, [appUser]);

    let mainContent = null;

    if (Object.keys(appUser).length === 0) {
        mainContent = <PageLoading />;
    } else {
        mainContent = (
            <Fragment>
                <TopContent {...appUser} downFn={downFn} />
                <DownList {...appUser} downFn={downFn} />
                <div className="download-bottom">
                    <div className="download__r">
                        <div className="download__r-logo"></div>
                        <div className="download__r-text">
                            想戴上最美的面具，又想卸下所有的伪装
                        </div>
                    </div>
                    <div className="download-btn" onClick={downFn}></div>
                </div>
            </Fragment>
        );
    }

    return <div className="room-share">{mainContent}</div>;
};

export default RoomShare;
