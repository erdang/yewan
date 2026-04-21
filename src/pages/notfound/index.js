import React, { useEffect } from 'react';
import { connect } from 'react-redux';
//import { get } from '@request';

const Home = () => {
    useEffect(() => {
        //get('suerdev-user.v.6.cn-bindMobile').then();
        return () => {};
    }, []);
    return <div>404</div>;
};

function mapStateTpProps(state) {
    return { ...state.home };
}

export default connect(mapStateTpProps)(Home);
