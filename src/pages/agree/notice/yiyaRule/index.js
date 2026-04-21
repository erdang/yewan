import './index.scss';

import React, { useEffect } from 'react';
import setTitle from '@/utility/settitle';
import urlTool from 'ox-util/src/url';

import DawerOverlay from '@/component/DawerOverlay';
import { appGate } from '@/utility/appGate';

const searchParam = urlTool.param(window.location.search);

const HelpRule = ({ setShowRule, ruledata }) => {
    return (
        <div className="help-rule">
            <div className="rule-content">
                <p className="r-title">1.什么是关系</p>
                <p>
                    关系是你跟好友的友谊的见证，双方确认之后才能绑定关系。绑定之后双方可以在个人主页晒出对方，获得亲密度增长并共同解锁多种特权。
                </p>
                <p className="r-title"> 2.如何绑定关系</p>
                <p>
                    在聊天室礼物面板、im私聊场景中，可在礼物栏里赠送任意关系礼物，将该道具赠送好友以发起邀请，对方同意后，即可成功绑定关系。注意：CP是唯一关系，一个账号只能绑定1个哦!!
                </p>
                <p>
                    跟一个好友也只能绑定一种关系哦，无论对方是否同意，都将消耗绑定道具且绑定邀请7日内有效。
                </p>
                <p className="r-title"> 3.特权说明</p>
                <p>
                    绑定后，双方在个人主页可以展示关系，获取亲密度解锁对应等级特权。
                </p>
                <p className="r-title"> 4.如何解绑关系</p>
                <p>
                    进入个人主页，点击任意关系头像，即可进入关系页面。点击解绑关系将花费886金币，解绑不需要双向确认，单向操作即可解绑成功。但解绑之后，积累的亲密度、关系等级、关系特权都将清零，请慎重操作。
                </p>
                <p className="r-title"> 5.亲密度说明</p>
                <p>
                    亲密度是双方亲密度的表现，绑定关系之后，双方的互动、陪伴都将增长亲密度。亲密度将换算为关系等级展示在关系卡片上。
                </p>
                <p className="r-title"> 6.如何增长亲密度</p>
                <p>
                    1.亲密关系双方互相赠送金币礼物可增加亲密度，1金币=1亲密度，赠送亲密关系礼物1金币=5亲密度
                </p>
                <p>
                    2.双方在同一房间陪伴可增加亲密度，1分钟=1亲密度，每日最多可获得120亲密度
                </p>
                <p>3.双方每日私聊对话一次可增加亲密度，每日限一次增加5亲密度</p>
                <p className="r-title"> 7.关系位上限</p>
                <p>
                    单个用户的关系上限为9个，其中3个关系位是系统默认，剩下6个关系位可通过购买获得。
                </p>
                <p className="r-title">8.等级说明</p>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>等级</th>
                                <th>亲密度</th>
                                <th>奖励</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>0</td>
                                <td>520金币关系礼物解锁</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>99999</td>
                                <td>关系气泡、关系头像框</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>199999</td>
                                <td>
                                    关系气泡、关系头像框、5200金币关系礼物解锁使用权
                                </td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>999999</td>
                                <td>
                                    关系气泡、关系头像框、5200金币关系礼物解锁使用权、解锁双人进场横幅
                                </td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>2013140</td>
                                <td>
                                    关系气泡、关系头像框、5200金币关系礼物解锁使用权、解锁双人连理枝效果
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const UserRule = () => {
    useEffect(() => {
        setTitle('契约说明');
    }, []);

    if (searchParam.type === 'real') {
        return (
            <div className="user-rule">
                <div className="rule-real"></div>
            </div>
        );
    } else if (searchParam.room === 'full') {
        return <HelpRule></HelpRule>;
    }
    return (
        <DawerOverlay className="turn-draw" onClose={appGate.closeWeb}>
            <HelpRule></HelpRule>
        </DawerOverlay>
    );
};

export default UserRule;
