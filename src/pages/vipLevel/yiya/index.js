import './index.scss';
import React, { useEffect } from 'react';

import MyLevel from '../component/Viplevel';
import { connect } from 'react-redux';
import urlTool from 'ox-util/src/url';
import setTitle from '@/utility/settitle';

const searchParam = urlTool.param(window.location.search);

const HelpRule = () => {
    return (
        <div className="help-rule">
            <div className="rule-content">
                <div className="r-title">1.VIP等级简介</div>
                <p>
                    VIP等级通过充值获得累积，当前充值距前30日内充值累积达到一定金额时，可获得对应特权，每个等级有效期为30天。
                </p>
                <div className="r-title">2.VIP等级对应表</div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>等级</th>
                                <th>30日累计充值</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>VIP1</td>
                                <td>3w</td>
                            </tr>
                            <tr>
                                <td>VIP2</td>
                                <td>5w</td>
                            </tr>
                            <tr>
                                <td>VIP3</td>
                                <td>10w</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="r-title">3.VIP等级特权</div>
                <p>
                    VIP用户享有等级特权，随着等级提升特权的数量也会随之增加。具体福利内容参见【VIP等级】页面中的特权内容。
                </p>
            </div>
        </div>
    );
};

var Level = function ({ ticket }) {
    useEffect(() => {
        setTitle('VIP特权');
    }, []);

    if (searchParam.rule === 'help') {
        return <HelpRule></HelpRule>;
    }
    if (searchParam.room === 'full') {
        return <MyLevel ticket={ticket}></MyLevel>;
    }
    return (
        <div className="vip__warp">
            <div className="vip__icon"></div>
            <div className="vip__text">敬请期待</div>
        </div>
    );
};

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(Level);
