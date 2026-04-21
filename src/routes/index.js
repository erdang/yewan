import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router';
// import { PageLoading } from '../component/PageLoading';
import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;

import retry from '@/utility/retry';
import TabIndex from '@/component/TabIndex';

const DownloadIpa = lazy(() => retry(() => import('../pages/downloadIpa')));
const DownloadHuan = lazy(() => retry(() => import('../pages/downloadHuan')));
const Mrank = lazy(() => retry(() => import('../pages/mrank')));

//op

const UploadCard = lazy(() =>
    retry(() => import('../pages/operations/uploadCard')),
);
const SignWork = lazy(() =>
    retry(() => import('../pages/operations/signWork')),
);

const CashList = lazy(() =>
    retry(() => import('../pages/operations/cashList')),
);
const GetCash = lazy(() => retry(() => import('../pages/operations/getCash')));

//test
const Test = lazy(() => retry(() => import('../pages/test/index')));
const OkTest = lazy(() => retry(() => import('../pages/oktest')));

const UpdateList = lazy(() =>
    retry(() => import('../pages/h5inapp/updateList')),
);
const HelibaoPay = lazy(() => retry(() => import('../pages/helibaoPay')));
const Kefu = lazy(() => retry(() => import('../pages/account/kefu')));
const NumShop = lazy(() => retry(() => import('../pages/numShop/yiya')));
const NoticeTip = lazy(() => retry(() => import('../pages/agree/noticeTip')));

const HeartBengbeng = lazy(() =>
    retry(() => import('../pages/h5inapp/heartBengbeng')),
);

//编写基本的路由路线，path为路径，component为对应渲染的组件，exact属性决定是否精准匹配
//auth h5是否需要登录  app 每次都会去拿ticket
const M_ROUTE = [
    {
        path: '/',
        element: <Navigate to="/home" />,
        exact: true,
        auth: false,
    },
    {
        path: '/',
        element: <Suspense fallback={<></>}>{<TabIndex></TabIndex>}</Suspense>,
        exact: true,

        auth: false,
        children: [
            {
                path: '/home',
                element: (
                    <Suspense fallback={<></>}>
                        {APPNAME[hostname].rule.home}
                    </Suspense>
                ),
                auth: false,

                exact: true,
            },
            {
                path: '/message',
                element: (
                    <Suspense fallback={<></>}>
                        {APPNAME[hostname].rule.home}
                    </Suspense>
                ),
                auth: true,

                exact: true,
            },
            {
                path: '/my',
                element: (
                    <Suspense fallback={<></>}>
                        {APPNAME[hostname].rule.myLevelNew}
                    </Suspense>
                ),
                auth: true,

                exact: true,
            },
        ],
    },

    {
        path: '/apply',
        element: (
            <Suspense fallback={<></>}>{APPNAME[hostname].rule.apply}</Suspense>
        ),
        exact: true,
        auth: true,
    },
    {
        path: '/applynew',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.applyNew}
            </Suspense>
        ),
        exact: true,
        auth: true,
    },
    {
        path: '/wchatPay',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.wchatPay}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },
    {
        path: '/wchatPub',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.wchatPub}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },
    {
        path: '/h5Pay/result',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.h5PayResult}
            </Suspense>
        ),

        exact: true,
        auth: false,
    },
    {
        path: '/h5Pay',
        element: (
            <Suspense fallback={<></>}>{APPNAME[hostname].rule.h5Pay}</Suspense>
        ),
        exact: true,
        auth: true,

        children: [
            {
                path: '/h5Pay/from',
                element: (
                    <Suspense fallback={<></>}>
                        {APPNAME[hostname].rule.h5Pay}
                    </Suspense>
                ),
                exact: true,
                auth: false,
            },
        ],
    },
    {
        path: '/bigBrotherPay',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.bigBrotherPay}
            </Suspense>
        ),
        exact: true,
        auth: false,

        children: [
            {
                path: '/bigBrotherPay/from',
                element: (
                    <Suspense fallback={<></>}>
                        {APPNAME[hostname].rule.bigBrotherPay}
                    </Suspense>
                ),
                exact: true,
                auth: false,
            },
        ],
    },

    {
        path: '/realName',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.realName}
            </Suspense>
        ),
        exact: true,
        auth: true,
    },
    {
        path: '/realNameOld',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.realNameOld}
            </Suspense>
        ),
        exact: true,
        auth: true,
    },
    {
        path: '/myLevel',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.myLevelOld}
            </Suspense>
        ),
        exact: true,
        auth: true,
    },
    {
        path: '/helibaoPay',
        element: (
            <Suspense fallback={<></>}>
                <HelibaoPay></HelibaoPay>
            </Suspense>
        ),
        children: [
            {
                path: '/helibaoPay/from',
                element: (
                    <Suspense fallback={<></>}>
                        <HelibaoPay></HelibaoPay>
                    </Suspense>
                ),
                exact: true,
                auth: true,
            },
            {
                path: '/helibaoPay/middlePage',
                element: (
                    <Suspense fallback={<></>}>
                        <HelibaoPay></HelibaoPay>
                    </Suspense>
                ),
                exact: true,
                auth: false,
            },
        ],
        exact: true,
        auth: false,
    },

    {
        path: '/myLevelNew',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.myLevelNew}
            </Suspense>
        ),
        exact: true,
        auth: true,
    },
    {
        path: '/vipLevel',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.vipLevel}
            </Suspense>
        ),
        exact: true,
        auth: true,
    },
    {
        path: '/numShop',
        element: (
            <Suspense fallback={<></>}>
                <NumShop></NumShop>
            </Suspense>
        ),
        exact: true,
        auth: true,
    },
    {
        path: '/levelTable',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.levelTable}
            </Suspense>
        ),
        exact: true,

        auth: false,
    },
    {
        path: '/downloadIpa',
        element: (
            <Suspense fallback={<></>}>
                <DownloadIpa></DownloadIpa>
            </Suspense>
        ),
        exact: true,

        auth: false,
    },
    {
        path: '/downloadHuanPai',
        element: (
            <Suspense fallback={<></>}>
                <DownloadHuan></DownloadHuan>
            </Suspense>
        ),
        exact: true,

        auth: false,
    },
    {
        path: '/search',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.search}
            </Suspense>
        ),
        exact: true,

        auth: false,
    },
    {
        path: '/logonPage',
        element: (
            <Suspense fallback={<></>}>{APPNAME[hostname].rule.login}</Suspense>
        ),
        exact: true,

        auth: false,
    },
    {
        path: '/mrank',
        element: (
            <Suspense fallback={<></>}>
                <Mrank></Mrank>
            </Suspense>
        ),
        exact: true,

        auth: false,
    },

    {
        path: '/roomShare',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.roomShare}
            </Suspense>
        ),
        children: [
            {
                path: '/roomShare/:roomId',
                element: APPNAME[hostname].rule.roomShare,
            },
        ],
        exact: true,

        auth: false,
    },
    {
        path: '/room',
        element: (
            <Suspense fallback={<></>}>{APPNAME[hostname].rule.room}</Suspense>
        ),
        children: [
            {
                path: '/room/:roomId',
                element: APPNAME[hostname].rule.room,
                auth: true,
            },
        ],
        exact: true,

        auth: true,
    },
    {
        path: '/live',
        element: (
            <Suspense fallback={<></>}>{APPNAME[hostname].rule.live}</Suspense>
        ),
        children: [
            {
                path: '/live/:roomId',
                element: APPNAME[hostname].rule.live,
                auth: false,
            },
        ],
        exact: true,

        auth: false,
    },
    // {
    //     path: '/list',
    //     loadData: loadData,
    //     element: <List></List>,
    // },
    {
        path: '*',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.notFound}
            </Suspense>
        ),

        auth: false,
    },
];

//op

const OP_ROUTE = [
    {
        path: '/getCash',
        element: (
            <Suspense fallback={<></>}>
                <GetCash />
            </Suspense>
        ),
        children: [
            {
                path: '/getCash/uploadCard',
                element: <UploadCard />,
                auth: true,
            },
            {
                path: '/getCash/getCashRule',
                element: (
                    <Suspense fallback={<></>}>
                        {APPNAME[hostname].rule.getCashRule}
                    </Suspense>
                ),
                auth: false,
            },
            {
                path: '/getCash/cashList',
                element: <CashList />,
                auth: true,
            },
        ],
        exact: true,
        auth: true,
    },
    {
        path: '/signWork',
        element: (
            <Suspense fallback={<></>}>
                <SignWork></SignWork>
            </Suspense>
        ),
        exact: true,
        auth: true,
    },
];
//account

const ACCOUNT_ROUTE = [
    {
        path: '/account/resetPhone',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.resetPhone}
            </Suspense>
        ),
        exact: true,
        auth: true,
    },
    {
        path: '/account/delete',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.deleteUser}
            </Suspense>
        ),
        exact: true,
        auth: true,
    },
    {
        path: '/account/bindPhone',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.bindPhone}
            </Suspense>
        ),
        exact: true,
        auth: true,
    },
    {
        path: '/account/register',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.register}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },
    {
        path: '/account/setPassword',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.setPassword}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },
    {
        path: '/account/forgetPassword',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.forgetPassword}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },
    {
        path: '/account/kefu',
        element: (
            <Suspense fallback={<></>}>
                <Kefu></Kefu>
            </Suspense>
        ),
        exact: true,
        auth: false,
    },
];
//rule
const RULE_ROUTE = [
    {
        path: '/agree/liveRule',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.liveRule}
            </Suspense>
        ),
        auth: false,
    },
    {
        path: '/agree/anchorRule',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.anchorRule}
            </Suspense>
        ),
        auth: false,
    },
    {
        path: '/agree/userRule',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.userRule}
            </Suspense>
        ),
        auth: false,
    },
    {
        path: '/agree/chargeRule',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.chargeRule}
            </Suspense>
        ),
        auth: false,
    },
    {
        path: '/agree/privacyPolicy',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.privacyPolicy}
            </Suspense>
        ),
        auth: false,
    },
    {
        path: '/agree/userRegisterRule',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.userRegisterRule}
            </Suspense>
        ),
        auth: false,
    },
    {
        path: '/agree/standardRule',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.standardRule}
            </Suspense>
        ),
        auth: false,
    },
    {
        path: '/agree/cardImg',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.cardImg}
            </Suspense>
        ),
        auth: false,
    },
    {
        path: '/agree/notice',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.notice}
            </Suspense>
        ),
        auth: false,
    },
    {
        path: '/agree/noticeTip',
        element: (
            <Suspense fallback={<></>}>
                <NoticeTip></NoticeTip>
            </Suspense>
        ),
        auth: false,
    },
];

//account

const HEALTH_ROUTE = [
    {
        path: '/suer-mobile/health',
        element: (
            <Suspense fallback={<></>}>
                <OkTest />
            </Suspense>
        ),
        exact: true,
        auth: false,
    },
];

//test

const TEST_ROUTE = [
    {
        path: '/test',
        element: (
            <Suspense fallback={<></>}>
                <Test />
            </Suspense>
        ),
        exact: true,
        auth: false,
    },
];

//appmate

const APPMATE_ROUTE = [
    {
        path: '/h5inapp/roomCenterAlert',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.roomCenterAlert}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },
    {
        path: '/h5inapp/heartBengbeng',
        element: (
            <Suspense fallback={<></>}>
                <HeartBengbeng></HeartBengbeng>
            </Suspense>
        ),
        exact: true,
        auth: false,
    },
    {
        path: '/h5inapp/rankTemplate',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.rankTemplate}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },

    {
        path: '/h5inapp/weekStar',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.weekStar}
            </Suspense>
        ),
        exact: true,
        auth: true,
    },

    {
        path: '/h5inapp/appimg',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.appimg}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },

    {
        path: '/h5inapp/ruleTemplate',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.ruleTemplate}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },

    {
        path: '/h5inapp/blindBox',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.blindBox}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },
    {
        path: '/h5inapp/blindBag',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.blindBag}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },

    {
        path: '/h5inapp/gameList',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.gameList}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },

    {
        path: '/h5inapp/firstCharge',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.firstCharge}
            </Suspense>
        ),
        exact: true,
        auth: true,
    },

    {
        path: '/h5inapp/secretMen',
        element: (
            <Suspense fallback={<></>}>
                {APPNAME[hostname].rule.secretMen}
            </Suspense>
        ),
        exact: true,
        auth: false,
    },

    {
        path: '/h5inapp/updateList',
        element: (
            <Suspense fallback={<></>}>
                <UpdateList></UpdateList>
            </Suspense>
        ),
        exact: true,
        auth: true,
    },
];
//game

const ROUTE = [
    ...M_ROUTE,
    ...OP_ROUTE,
    ...RULE_ROUTE,
    ...ACCOUNT_ROUTE,
    ...HEALTH_ROUTE,
    ...TEST_ROUTE,
    ...APPMATE_ROUTE,
];

//将路由表数组导出
export default ROUTE;
