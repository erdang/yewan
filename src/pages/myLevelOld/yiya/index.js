import './index.scss';
import React, { useEffect } from 'react';

import MyLevel from './componet/Mylevel';
import { connect } from 'react-redux';

import urlTool from 'ox-util/src/url';
import setTitle from '@/utility/settitle';

const searchParam = urlTool.param(window.location.search);

const HelpRule = () => {
    return (
        <div className="help-rule">
            <div className="rule-content">
                <div className="r-title">1.什么是活跃等级</div>
                <p>
                    活跃等级体系采用经验值升级制度，用户每在聊天室消费1Z币则获得1点经验值。
                </p>
                <div className="r-title">2.如何提升活跃等级</div>
                <p>
                    用户每天可通过观看语音房、发送聊天消息、赠送免费礼物、分享直播问和点赞或评论动态获得不等的经验值。
                    观看直播：2分钟=1经验，每日最高15经验。发送聊天消息：1条消息=1经验，每日最高5经验，直播间内和私聊均可。分享直播问：1次分享=3经验，每日最高9经验。评论动态/点赞动态：1次发布动态/评论/点赞=3经验，每日最高9经验。荣誉等级可进行活跃等级的加成提升，具体参见【荣誉特权】说明页面。
                </p>
                <div className="r-title">3.用户等级对应福利</div>
                <p>
                    我们为不同等级的用户提供了不同的专属特权，用来奖励您的付出。随着用户等级的提升，特权也随之增加。具体福利内容参见【活跃特权】页面中，点亮的当前等级可享受的特权内容。
                </p>
            </div>
        </div>
    );
};
var Level = function ({ ticket }) {
    useEffect(() => {
        setTitle('活跃等级');
    }, []);

    if (searchParam.rule === 'help') {
        return <HelpRule></HelpRule>;
    }
    return <MyLevel ticket={ticket}></MyLevel>;
};

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(Level);
