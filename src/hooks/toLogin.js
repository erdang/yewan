import { useLocation, useNavigate, matchRoutes } from 'react-router-dom';
import routesConfig from '@/routes';
import { useEffect, useState } from 'react';

import urltool from 'ox-util/src/url';
import { appGate } from '@/utility/appGate';
import USER from '@/utility/user';

//路由守卫 鉴权
const useToLogin = (ticket) => {
    const [has, setHas] = useState(false);
    let { pathname, search } = useLocation();
    let native = useNavigate();
    const searchParam = urltool.param(window.location.search);
    //room 房间号是变化的 比较特殊 单独处理
    let next = pathname + encodeURIComponent(search);
    let nowpath = matchRoutes(routesConfig, pathname);
    useEffect(() => {
        if (!appGate.inApp()) {
            if (
                nowpath[nowpath.length - 1].route.auth === true &&
                searchParam.type !== 'paste' &&
                (ticket === 'null' || !ticket)
            ) {
                native('/logonPage?next=' + next);
            } else {
                setHas(true);
            }
        } else if (appGate.inApp()) {
            if (ticket === 'null' || !ticket) {
                USER.synchronizeWithApp().then(() => {
                    setHas(true);
                });
            } else {
                setHas(true);
            }
        }
    }, [pathname, native, next, nowpath, searchParam, ticket]);

    return { has };
};
export default useToLogin;
