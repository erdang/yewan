import './index.scss';

import { connect } from 'react-redux';
import React from 'react';
import ApplyNew from '@/component/ApplyNew';

const ApplyPage = (props) => {
    return <ApplyNew {...props} real={1}></ApplyNew>;
};

const mapStateTpProps = (state) => {
    return { ...state.apply, ...state.user };
};

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(ApplyPage);
