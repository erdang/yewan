import './index.scss';

import React, { useEffect } from 'react';
import UserRegisterRule from '@/component/Rule/UserRegisterRule';
import LayoutHead from '@/component/LayoutHead';
import setTitle from '@/utility/settitle';
// import { appGate } from '@/utility/appGate';
import urlTool from 'ox-util/src/url';
const searchParam = urlTool.param(window.location.search);

const UserRule = () => {
    useEffect(() => {
        setTitle('用户注册协议');
    }, []);

    return (
        <div className="user-rule">
            {searchParam.nav !== 'none' && <LayoutHead title="用户注册协议" />}
            <UserRegisterRule></UserRegisterRule>
        </div>
    );
};

export default UserRule;
