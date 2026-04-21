import './index.scss';

import React, { useEffect } from 'react';
import LayoutHead from '@/component/LayoutHead';
import ChargeRule from '@/component/Rule/ChargeRule';
import { appGate } from '@/utility/appGate';
import setTitle from '@/utility/settitle';

const UserRule = () => {
    useEffect(() => {
        setTitle('充值协议');
    }, []);
    return (
        <div className="user-rule">
            {!appGate.inApp() && <LayoutHead title="充值用户协议" />}
            <ChargeRule></ChargeRule>
        </div>
    );
};

export default UserRule;
