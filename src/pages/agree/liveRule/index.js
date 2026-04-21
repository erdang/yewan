import './index.scss';

import React, { useEffect } from 'react';
import LayoutHead from '@/component/LayoutHead';
import LiveRule from '@/component/Rule/LiveRule';
import { appGate } from '@/utility/appGate';
import setTitle from '@/utility/settitle';

const UserRule = () => {
    useEffect(() => {
        setTitle('直播管理规定');
    }, []);

    return (
        <div className="user-rule">
            {!appGate.inApp() && <LayoutHead title="直播管理规定" />}
            <LiveRule />
        </div>
    );
};

export default UserRule;
