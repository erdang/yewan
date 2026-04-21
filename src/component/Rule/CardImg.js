import React, { Fragment } from 'react';

import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;
const cardUrl = APPNAME[hostname].cardUrl;

const Home = () => {
    return (
        <Fragment>
            <img src={cardUrl} alt="" />
        </Fragment>
    );
};

export default Home;
