import './index.scss';

import React, { useEffect } from 'react';
import setTitle from '@/utility/settitle';
import LayoutHead from '@/component/LayoutHead';
import UseRule from '@/component/Rule/UseRule';
// import { appGate } from '@/utility/appGate';
import urlTool from 'ox-util/src/url';
const searchParam = urlTool.param(window.location.search);
// import VConsole from 'vconsole';

// // eslint-disable-next-line no-unused-vars
// const vConsole = new VConsole();
const UserRule = () => {
    useEffect(() => {
        setTitle('用户协议');
        // console.log(typeof window.webkit);
    }, []);

    return (
        <div className="user-rule">
            {searchParam.nav !== 'none' && <LayoutHead title="用户协议" />}
            <UseRule></UseRule>
        </div>
    );
};

export default UserRule;
