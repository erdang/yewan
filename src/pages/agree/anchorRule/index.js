import './index.scss';

import React, { useEffect } from 'react';
import LayoutHead from '@/component/LayoutHead';
import AnchorRule from '@/component/Rule/AnchorRule';
import { appGate } from '@/utility/appGate';
import setTitle from '@/utility/settitle';

const UserRule = () => {
    useEffect(() => {
        setTitle('主播用户协议');
    }, []);

    return (
        <div className="user-rule">
            {!appGate.inApp() && <LayoutHead title="主播用户协议" />}
            <AnchorRule />
        </div>
    );
};

export default UserRule;
