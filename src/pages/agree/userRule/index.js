import './index.scss';

import React, { useEffect } from 'react';
import setTitle from '@/utility/settitle';
import LayoutHead from '@/component/LayoutHead';
import UseRule from '@/component/Rule/UseRule';
import { appGate } from '@/utility/appGate';

const UserRule = () => {
    useEffect(() => {
        setTitle('用户协议');
    }, []);

    return (
        <div className="user-rule">
            {!appGate.inApp() && <LayoutHead title="用户协议" />}
            <UseRule></UseRule>
        </div>
    );
};

export default UserRule;
