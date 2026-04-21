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
            .get('/api/v1/activityUpList/index', {
                params: {
                    token: ticket,
                },
            })
            .then((s) => {
                setInfo(s.content);
            });
    }, [ticket]);

    let bContent =
        info &&
        info.data.map((i, d) => {
            return (
                <div className="blind__content" key={d}>
                    <div className="top__title">{i.title}</div>
                    <div className="top__tips">【{i.body.tag_name}】</div>
                    <div className="top__bottom"></div>
                    <div className="blind__gift">
                        <ul>
                            {i.body.gift.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <div className="li__gift-name">
                                            【{item.name}】
                                        </div>
                                        <div className="li__gift-num">
                                            {item.coin}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="g__time">
                        更新时间:{i.body.release_time}
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
            </div>
        );
    }
    return <Fragment>{mainContent}</Fragment>;
};

var BlindBoxPage = function ({ ticket }) {
    useEffect(() => {
        setTitle('活动更新计划');
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
