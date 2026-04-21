import {
    BrowserRouter as Router,
    useRoutes,
    useLocation,
    useNavigate,
    matchRoutes,
} from 'react-router-dom';
import routesConfig from '@/routes';
import React, { useEffect, useState, Fragment } from 'react';
import { Provider } from 'react-redux';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import createStore from '@/store/index';
import mediator from 'ox-util/src/mediator';
import urltool from 'ox-util/src/url';
import { appGate } from '@/utility/appGate';
import USER from '@/utility/user';

// 这里是同步前后端的数据，避免重复渲染
const StoreFromServer =
    window.__STORE__ === '{{store}}' ? '{}' : window.__STORE__;
// console.log(StoreFromServer);
let initialState = '';
if (StoreFromServer !== 'undefined') {
    initialState = StoreFromServer && JSON.parse(StoreFromServer);
}

const searchParam = urltool.param(window.location.search);

const store = createStore(initialState);
mediator.subscribe('changeTicket', (ticket) => {
    store.dispatch({
        type: 'CHANGE_TICKET',
        ticket: ticket,
    });
});
mediator.subscribe('userInfo', (userinfo) => {
    store.dispatch({
        type: 'CHANGE_USERINFO',
        userInfo: userinfo,
    });
});

const HelTitle = () => {
    return <Helmet></Helmet>;
};
//路由守卫 鉴权
const Add = () => {
    const [has, setHas] = useState(false);
    let { pathname, search } = useLocation();
    let native = useNavigate();
    //room 房间号是变化的 比较特殊 单独处理
    let next = pathname + encodeURIComponent(search);
    let nowpath = matchRoutes(routesConfig, pathname);
    useEffect(() => {
        let { user } = store.getState();

        if (!appGate.inApp()) {
            if (
                nowpath[nowpath.length - 1].route.auth === true &&
                searchParam.type !== 'paste' &&
                (user.ticket === 'null' || !user.ticket)
            ) {
                console.log('auth:需要登录');
                native('/logonPage?next=' + next);
            } else {
                setHas(true);
            }
        } else if (appGate.inApp()) {
            // 逍遥模拟器 加载快 票还没拿到 页面就渲染了，从新获取一下票
            // app 里面的是否需要登录 通过 页面是否需要票 来判断 不通过 auth

            if (
                nowpath[nowpath.length - 1].route.auth === true &&
                searchParam.type !== 'paste'
            ) {
                if (user.ticket === 'null' || !user.ticket) {
                    USER.synchronizeWithApp().then(() => {
                        setHas(true);
                    });
                } else {
                    USER.synchronizeWithApp().then(() => {
                        setHas(true);
                    });
                }
            } else {
                setHas(true);
            }
        }
    }, [pathname, native, next, nowpath]);

    let routes = useRoutes(
        has
            ? routesConfig
            : [
                  {
                      path: '*',
                      element: <></>,
                  },
              ],
    );

    return routes;
};

export default function App() {
    return (
        <Provider store={store}>
            <HelmetProvider>
                <Router>
                    <Add />
                    <HelTitle></HelTitle>
                </Router>
            </HelmetProvider>
        </Provider>
    );
}
