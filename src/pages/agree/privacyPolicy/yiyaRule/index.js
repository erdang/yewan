import './index.scss';

import React, { useEffect } from 'react';
import LayoutHead from '@/component/LayoutHead';
import PrivacyPolicy from '@/component/Rule/PrivacyPolicy';

import setTitle from '@/utility/settitle';
// import { appGate } from '@/utility/appGate';
import urlTool from 'ox-util/src/url';
const searchParam = urlTool.param(window.location.search);

const UserRule = () => {
    useEffect(() => {
        setTitle('隐私政策');
    }, []);

    return (
        <div className="user-rule">
            {searchParam.nav !== 'none' && <LayoutHead title="隐私政策" />}
            <PrivacyPolicy></PrivacyPolicy>
        </div>
    );
};

export default UserRule;
