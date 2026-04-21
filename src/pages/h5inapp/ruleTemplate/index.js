import './index.scss';

import React, { useCallback } from 'react';

import { connect } from 'react-redux';

import CenterOverlay from '@/component/CenterOverlay';
import Portal from '@/component/Protal';

import urlTool from 'ox-util/src/url';
// import setTitle from '@/utility/settitle.js';
// import { appGate } from '@/utility/appGate.js';

const searchParam = urlTool.param(window.location.search);

const RuleAlert = ({ setShow, tabKeyv, timeCurrent, status }) => {
    const closeAlert = useCallback(() => {
        setShow(false);
    }, [setShow]);

    return (
        <Portal>
            <CenterOverlay className="weekstar-alert" onClose={closeAlert}>
                <div className="title-icon"></div>
                <div className="rule__h1">魅力之星</div>
                <p>
                    1.活动时间为每周一0：00至每周日24：00，按用户收礼数量排名，周日24:00结榜单,认证主播方可上榜；
                </p>
                <p>
                    2.第一名获得奖励（上线全站飘屏提醒、价值1314Z币的礼物、专属头像框7天）；
                    第二名获得奖励（上线全站飘屏提醒、价值1314Z币的礼物、专属头像框5天）
                    第三名获得奖励（上线全站飘屏提醒、价值1314Z币的礼物、专属头像框3天）
                </p>
                <div className="rule__h1">名气之星</div>
                <p>
                    1.活动时间为每周一0：00至每周日24：00，按用户送礼数量排名，周日24:00结榜单,收礼方需是认证主播身份您方可上榜；
                </p>
                <p>
                    2.第一名获得奖励（专属礼物冠名7天、专属头像框7天）；
                    第二名获得奖励（专属头像框5天）第三名获得奖励（专属头像框3天）；
                </p>
            </CenterOverlay>
        </Portal>
    );
};

var WeekStar = function ({ ticket }) {
    if (searchParam.type === 'roomRule') {
        return <RuleAlert />;
    }
};
function mapStateTpProps(state) {
    return { ...state.user };
}

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(WeekStar);
