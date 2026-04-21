import './index.scss';
import React, { useEffect } from 'react';
import LayoutHead from '../../../component/LayoutHead';
import CardImg from '../../../component/Rule/CardImg';

import { appGate } from '../../../utility/appGate';
import setTitle from '../../../utility/settitle';

const Home = () => {
    useEffect(() => {
        setTitle('证书');
    }, []);
    return (
        <div className="card-img">
            {!appGate.inApp() && <LayoutHead title="证书" />}
            <CardImg />
        </div>
    );
};

export default Home;
