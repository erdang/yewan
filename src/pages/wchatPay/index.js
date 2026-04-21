import './index.scss';

import React from 'react';
import { connect } from 'react-redux';
import Manager, { Success, ErrFailed } from '@/component/WchatPay';
import urltool from 'ox-util/src/url';

const searchParam = urltool.param(window.location.search);

const PageMain = ({ ticket, userInfo }) => {
    if (searchParam.type === 'success') {
        return <Success></Success>;
    }
    if (searchParam.type === 'faileed') {
        return <ErrFailed></ErrFailed>;
    }

    return <Manager ticket={ticket} userInfo={userInfo}></Manager>;
};
const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(PageMain);
