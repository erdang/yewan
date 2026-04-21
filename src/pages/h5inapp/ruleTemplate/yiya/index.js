import './index.scss';

import React, { useCallback } from 'react';

import { connect } from 'react-redux';

import CenterOverlay from '@/component/CenterOverlay';
import Portal from '@/component/Protal';

import urlTool from 'ox-util/src/url';
// import setTitle from '@/utility/settitle.js';
import { appGate } from '@/utility/appGate.js';

const searchParam = urlTool.param(window.location.search);

const RuleWhole = () => {
    const closeAlert = useCallback(() => {
        appGate.closeWeb();
    }, []);

    return (
        <Portal>
            <CenterOverlay className="rule__common-alert" onClose={closeAlert}>
                <div className="title-icon">规则说明</div>
                1、排行榜分值是由综合维度组合的；包含赠送礼物、收取礼物、用户在线时长、用户发言次数；
                <br />
                2、日榜是以每日0点到次日0点得周期内进行累计排序的；
                <br />
                3、周榜是以每周一0点到次周一0点得周期内进行累计排序的；
                <br />
                4、月榜是以每月1日0点到次月1日0点得周期内进行累计排序的；
                <br />
            </CenterOverlay>
        </Portal>
    );
};
const RuleRoom = () => {
    const closeAlert = useCallback(() => {
        appGate.closeWeb();
    }, []);

    return (
        <Portal>
            <CenterOverlay className="rule__common-alert" onClose={closeAlert}>
                <div className="title-icon">规则说明</div>
                1、排行榜分值是由综合维度组合的；包含赠送礼物、收取礼物、用户在线时长、用户发言次数；
                <br />
                2、日榜是以每日0点到次日0点得周期内进行累计排序的；
                <br />
                3、周榜是以每周一0点到次周一0点得周期内进行累计排序的；
                <br />
                4、月榜是以每月1日0点到次月1日0点得周期内进行累计排序的；
                <br />
            </CenterOverlay>
        </Portal>
    );
};

var WeekStar = function ({ ticket }) {
    if (searchParam.type === 'room') {
        return <RuleRoom />;
    }
    if (searchParam.type === 'whole') {
        return <RuleWhole />;
    }
};
function mapStateTpProps(state) {
    return { ...state.user };
}

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(WeekStar);
