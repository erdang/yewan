import './index.scss';

import React from 'react';
import { connect } from 'react-redux';
import Home from '@/component/Home';

const HomePage = () => {
    return <Home></Home>;
};

function mapStateTpProps(state) {
    return { ...state.home };
}

export default connect(mapStateTpProps)(HomePage);
