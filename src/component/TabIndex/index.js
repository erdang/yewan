import './index.scss';

import React, { useEffect, useCallback, Fragment } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import { TabBar } from 'antd-mobile';
import { AppOutline, UserOutline } from 'antd-mobile-icons';

//import useStyles from 'isomorphic-style-loader/useStyles';

const Home = ({ ticket }) => {
    const Navigate = useNavigate();
    const location = useLocation();
    const { pathname } = location;

    const tabs = [
        // {
        //     key: '/message',
        //     title: '消息',
        //     icon: (active) => (active ? <MessageFill /> : <MessageOutline />),
        //     badge: '',
        // },
        {
            key: '/home',
            title: '首页',
            icon: <AppOutline />,
        },
        {
            key: '/my',
            title: '我的',
            icon: <UserOutline />,
        },
    ];

    const setRouteActive = useCallback(
        (value) => {
            console.log(value);
            Navigate(value);
        },
        [Navigate],
    );

    //useStyles(s);
    useEffect(() => {}, []);

    return (
        <Fragment>
            <div className="page__home">
                <Outlet></Outlet>
            </div>
            <div className="tab-bar">
                <TabBar onChange={setRouteActive} activeKey={pathname}>
                    {tabs.map((item) => (
                        <TabBar.Item
                            key={item.key}
                            icon={item.icon}
                            title={item.title}
                            badge={item.badge}
                        />
                    ))}
                </TabBar>
            </div>
        </Fragment>
    );
};

function mapStateTpProps(state) {
    return { ...state.user };
}

export default connect(mapStateTpProps)(Home);
