import './index.scss';

import React from 'react';
import { connect } from 'react-redux';
import Manager, { Success, ErrFailed } from '@/component/H5Pay';
import urltool from 'ox-util/src/url';

const searchParam = urltool.param(window.location.search);
const WAY = [
    {
        name: '微信支付',
        gatetype: 'wechatH5',
        mid: 1627860053,
    },
    {
        name: '支付宝支付',
        gatetype: 'unionPayH5',
        mid: '',
    },
];
const step2Url = 'bigBrotherPay';

const PageMain = ({ ticket, userInfo }) => {
    if (searchParam.type === 'success') {
        return <Success step2Url={step2Url}></Success>;
    }
    if (searchParam.type === 'faileed') {
        return <ErrFailed></ErrFailed>;
    }
    return (
        <Manager
            ticket={ticket}
            userInfo={userInfo}
            WAY={WAY}
            step2Url={step2Url}
        ></Manager>
    );
};
const mapStateTpProps = (state) => {
    return { ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(PageMain);
