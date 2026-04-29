import React, { lazy } from 'react';
import retry from './retry';
import { appGate } from '@/utility/appGate';
import browser from 'ox-util/src/browser';
import urlTool from 'ox-util/src/url';
//rule
const H5PayResult = lazy(() =>
    retry(() => import('../pages/h5Pay/yiya/result')),
);
//yiya
const YiyaLiverule = lazy(() =>
    retry(() => import('../pages/agree/liveRule/yiyaRule')),
);
const YiyaAnchorRule = lazy(() =>
    retry(() => import('../pages/agree/anchorRule/yiyaRule')),
);
const YiyaCardImg = lazy(() =>
    retry(() => import('../pages/agree/cardImg/yiyaRule')),
);
const YiyaUserRule = lazy(() =>
    retry(() => import('../pages/agree/userRule/yiyaRule')),
);
const YiyaChargeRule = lazy(() =>
    retry(() => import('../pages/agree/chargeRule/yiyaRule')),
);
const YiyaGetCashRule = lazy(() =>
    retry(() => import('../pages/agree/getCashRule/yiyaRule')),
);
const YiyaPrivacyPolicy = lazy(() =>
    retry(() => import('../pages/agree/privacyPolicy/yiyaRule')),
);
const YiyaUserRegisterRule = lazy(() =>
    retry(() => import('../pages/agree/userRegisterRule/yiyaRule')),
);
const YiyaStandardRule = lazy(() =>
    retry(() => import('../pages/agree/standardRule/yiyaRule')),
);
const YiyaNotice = lazy(() =>
    retry(() => import('../pages/agree/notice/yiyaRule')),
);
//account
const YiyaResetPhone = lazy(() =>
    retry(() => import('../pages/account/resetPhone/yiya')),
);
const YiyaDeleteUser = lazy(() =>
    retry(() => import('../pages/account/delete/yiya')),
);
const YiyaBindPhone = lazy(() =>
    retry(() => import('../pages/account/bindPhone/yiya')),
);
const YiyaLogin = lazy(() =>
    retry(() => import('../pages/account/login/yiya')),
);
const YiyaRegister = lazy(() =>
    retry(() => import('../pages/account/register/yiya')),
);
const YiyaSetPassword = lazy(() =>
    retry(() => import('../pages/account/setPassword/yiya')),
);
const YiyaForgetPassword = lazy(() =>
    retry(() => import('../pages/account/forgetPassword/yiya')),
);
//

const YiyaApply = lazy(() => retry(() => import('../pages/apply/yiya')));
const YiyaApplyNew = lazy(() => retry(() => import('../pages/applynew/yiya')));
const YiyaRealName = lazy(() => retry(() => import('../pages/realName/yiya')));
const YiyaH5Pay = lazy(() => retry(() => import('../pages/h5Pay/yiya')));
const YiyaBigBrotherPay = lazy(() =>
    retry(() => import('../pages/bigBrotherPay/yiya')),
);

const YiyaHome = lazy(() => retry(() => import('../pages/home/yiya')));
const YiyaNotFound = lazy(() => retry(() => import('../pages/notfound/yiya')));
const YiyaRoom = lazy(() => retry(() => import('../pages/room/yiya')));
const YiyaLive = lazy(() => retry(() => import('../pages/live/yiya')));
const YiyaMyLevel = lazy(() => retry(() => import('../pages/myLevel/yiya')));
const YiyaMyLevelOld = lazy(() =>
    retry(() => import('../pages/myLevelOld/yiya')),
);
const YiyaVipLevel = lazy(() => retry(() => import('../pages/vipLevel/yiya')));
const YiyaLevelTable = lazy(() =>
    retry(() => import('../pages/levelTable/yiya')),
);
const YiyaSearch = lazy(() => retry(() => import('../pages/search/yiya')));
const YiyaRoomShare = lazy(() =>
    retry(() => import('../pages/roomShare/yiya')),
);

const YiyaWchatPay = lazy(() => retry(() => import('../pages/wchatPay/yiya')));
const YiyaWchatPub = lazy(() => retry(() => import('../pages/wchatPub/yiya')));

//h5inapp
const YiyaRoomCenterAlert = lazy(() =>
    retry(() => import('../pages/h5inapp/roomCenterAlert/yiya')),
);
const YiyaBlindBox = lazy(() =>
    retry(() => import('../pages/h5inapp/blindBox')),
);
const YiyaBlindBag = lazy(() =>
    retry(() => import('../pages/h5inapp/blindBag')),
);

const YiyaRankTemplate = lazy(() =>
    retry(() => import('../pages/h5inapp/rankTemplate/yiya')),
);

const YiyaWeekStar = lazy(() =>
    retry(() => import('../pages/h5inapp/weekStar/yiya')),
);

const YiyaAppimg = lazy(() =>
    retry(() => import('../pages/h5inapp/appimg/yiya')),
);
const YiyaRuleTemplate = lazy(() =>
    retry(() => import('../pages/h5inapp/ruleTemplate/yiya')),
);

const YiyaFirstCharge = lazy(() =>
    retry(() => import('../pages/h5inapp/firstCharge')),
);

const YIYA_RULE = {
    liveRule: <YiyaLiverule />,
    anchorRule: <YiyaAnchorRule />,
    cardImg: <YiyaCardImg />,
    userRule: <YiyaUserRule />,
    chargeRule: <YiyaChargeRule />,
    getCashRule: <YiyaGetCashRule />,
    privacyPolicy: <YiyaPrivacyPolicy />,
    userRegisterRule: <YiyaUserRegisterRule />,
    standardRule: <YiyaStandardRule />,
    notice: <YiyaNotice />,
    resetPhone: <YiyaResetPhone />,
    deleteUser: <YiyaDeleteUser />,
    bindPhone: <YiyaBindPhone />,
    setPassword: <YiyaSetPassword />,
    forgetPassword: <YiyaForgetPassword />,
    login: <YiyaLogin />,
    register: <YiyaRegister />,
    applyNew: <YiyaApplyNew />,
    apply: <YiyaApply />,
    realName: <YiyaRealName />,
    home: <YiyaHome />,
    notFound: <YiyaNotFound />,
    room: <YiyaRoom />,
    live: <YiyaLive />,
    myLevelOld: <YiyaMyLevelOld />,
    myLevelNew: <YiyaMyLevel />,
    vipLevel: <YiyaVipLevel />,
    levelTable: <YiyaLevelTable />,
    search: <YiyaSearch />,
    wchatPay: <YiyaWchatPay />,
    wchatPub: <YiyaWchatPub />,
    roomShare: <YiyaRoomShare />,
    roomCenterAlert: <YiyaRoomCenterAlert />,
    rankTemplate: <YiyaRankTemplate />,
    weekStar: <YiyaWeekStar />,

    appimg: <YiyaAppimg />,
    ruleTemplate: <YiyaRuleTemplate />,
    h5Pay: <YiyaH5Pay />,
    bigBrotherPay: <YiyaBigBrotherPay />,
    h5PayResult: <H5PayResult />,
    blindBox: <YiyaBlindBox />,
    blindBag: <YiyaBlindBag />,

    firstCharge: <YiyaFirstCharge />,
};

const searchParam = urlTool.param(window.location.search);
let yiaIos = '';
let companyName = '南京闲娱网络科技有限公司';
let companyAdress =
    '江苏省南京市江宁区秣陵街道天元中路126号新城发展中心02栋415室(江宁开发区';
let appname = '椰壳 ';
let cardUrl = '//s0.gxjiaman.com/static/h5_static/buz/buzz_yyzz.jpg';
let shortName = '南京闲娱';
if (
    (appGate.inApp() && appGate.inAppAndroid()) ||
    browser.isandroid() ||
    searchParam.type === 'android'
) {
    yiaIos = false;
} else if (
    (appGate.inApp() && appGate.inAppIOS()) ||
    browser.isiOS() ||
    searchParam.type === 'ios'
) {
    yiaIos = true;
}

const APPNAME = {
    localhost: {
        companyName: companyName,
        companyAdress: companyAdress,
        shortName: shortName,
        appname: appname,
        proBaseURL: '/',
        proBaseURL_USER: '/',
        proBaseURL_PIC: '/',
        rule: YIYA_RULE,
        cardUrl: cardUrl,
        staticUrl: '//s3.njxianyuwl.cn/static/h5_static',
        baseColor: '#fff',
        loadingColor: '#4587F7',
        yiaIos: yiaIos,
        downUrl: 'https://www.gxjiaman.com/app/downloads?channel=101275 ',
        logo: 'https://s3.njxianyuwl.cn/static/h5_static/yeke_logo.png',
        unit: '钻石',
        money: '金币',
        gameunit: '罐头',
        gameUrl: '/',
        h5Url: 'localhost',
        appType: 2,
        createTime: '2026年3月25日',
    },
    'dev-h5.njxianyuwl.cn': {
        companyName: companyName,
        companyAdress: companyAdress,
        shortName: shortName,
        appname: appname,
        proBaseURL: 'https://dev-api.njxianyuwl.cn',
        proBaseURL_USER: 'https://dev-api.njxianyuwl.cn',
        proBaseURL_PIC: 'https://dev-api.njxianyuwl.cn',
        rule: YIYA_RULE,
        cardUrl: cardUrl,
        staticUrl: 'https://s3.njxianyuwl.cn/static/h5_static',
        baseColor: '#fff',
        loadingColor: '#4587F7',
        yiaIos: yiaIos,
        downUrl: 'https://www.gxjiaman.com/app/downloads?channel=101275 ',
        logo: 'https://s3.njxianyuwl.cn/static/h5_static/yeke_logo.png',
        unit: '钻石',
        money: '金币',
        gameUrl: 'https://dev-gate.njxianyuwl.cn',
        h5Url: 'https://dev-h5.njxianyuwl.cn',
        appType: 2,
        createTime: '2026年3月25日',
    },
    'h5.njxianyuwl.cn': {
        companyName: companyName,
        companyAdress: companyAdress,
        shortName: shortName,
        appname: appname,
        proBaseURL: 'https://api.njxianyuwl.cn',
        proBaseURL_USER: 'https://api.njxianyuwl.cn',
        proBaseURL_PIC: 'https://api.njxianyuwl.cn',
        rule: YIYA_RULE,
        cardUrl: cardUrl,
        staticUrl: 'https://s3.njxianyuwl.cn/static/h5_static',
        baseColor: '#fff',
        loadingColor: '#4587F7',
        yiaIos: yiaIos,
        downUrl: 'https://www.gxjiaman.com/app/downloads?channel=101275 ',
        logo: 'https://s3.njxianyuwl.cn/static/h5_static/yeke_logo.png',
        unit: '钻石',
        money: '金币',
        gameUrl: 'https://gate.njxianyuwl.cn',
        h5Url: 'https://h5.njxianyuwl.cn',
        appType: 2,
        createTime: '2026年3月25日',
    },
};

export { APPNAME };
