import './index.scss';

import React, { useEffect } from 'react';
import LayoutHead from '@/component/LayoutHead';
import StandardRule from '@/component/Rule/StandardRule';
import setTitle from '@/utility/settitle';
import { appGate } from '@/utility/appGate';

const UserRule = () => {
    useEffect(() => {
        setTitle('平台行为规范');
    }, []);

    return (
        <div className="user-rule">
            {!appGate.inApp() && <LayoutHead title="平台行为规范" />}
            <StandardRule></StandardRule>
        </div>
    );
};

export default UserRule;
