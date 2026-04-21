import './index.scss';

import React from 'react';
import { connect } from 'react-redux';
import DelePhone from '@/component/Account/DeleteUser';
import { appGate } from '@/utility/appGate.js';
import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;
const money = APPNAME[hostname].money;

const Intro = function () {
    return (
        <div className="intro">
            <header>开始注销前，请确认以下内容</header>
            <h1>• 账号无任何资产或主动放弃资产</h1>
            <div>
                账号资产包括但不限于{money}、金币、道具、会员卡、
                待提现或提现待到账货币等相关内容。
            </div>
            <h1>• 信息将被删除，账号将不可找回</h1>
            <div>
                账号注销后，相关信息和作品等，
                例如您的动态、关注、私信等信息会被删除，且无法恢复。
            </div>
            <div>
                账号注销后，会在所有的设备上被登出，并且账号绑定手机、
                邮箱等相关信息将被释放，账号将无法登录及找回账号。
            </div>
            <div>苹果账号注销后半小时内会清空所有数据</div>
            <h1>
                • 账号注销期间请不要操作充值、购买道具等涉及钱财的操作，
                避免被注销后不必要的财产损失！
            </h1>
            <h1>• 已加入公会的账号，请先退出公会，之后才可进行注销。</h1>
            <h1>• 经纪公司室主或公会长，请先解除身份，之后才可进行注销。</h1>
            <h1 className="reason">• 请填写注销原因（选填）</h1>
        </div>
    );
};
const IntroIos = function () {
    return (
        <div className="intro">
            <header>开始注销前，请确认以下内容</header>
            <h1>• 账号无任何资产或主动放弃资产</h1>
            <div>账号资产包括但不限于个人信息等相关内容。</div>
            <h1>• 信息将被删除，账号将不可找回</h1>
            <div>
                账号注销后，相关信息和作品等，
                例如您的动态、关注、私信等信息会被删除，且无法恢复。
            </div>
            <div>
                账号注销后，会在所有的设备上被登出，并且账号绑定手机、
                邮箱等相关信息将被释放，账号将无法登录及找回账号。
            </div>

            <h1 className="reason">• 请填写注销原因（选填）</h1>
        </div>
    );
};

const DeletePage = (prop) => {
    return (
        <DelePhone
            InfoText={appGate.inApp() && appGate.inAppIOS() ? IntroIos : Intro}
            {...prop}
        />
    );
};

const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {
    ChangeFromStatePhoneFn: (phone) => {
        return { type: 'CHANGE_PHONE', phone };
    },
};

export default connect(mapStateTpProps, mapDispatchToProps)(DeletePage);
