import React from 'react';
import { DotLoading } from 'antd-mobile';
import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;

const PageLoading = () => {
    const style = {
        fontSize: '30px',
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: APPNAME[hostname].loadingColor,
        backgroundColor: APPNAME[hostname].baseColor,
    };

    return (
        <div className="loading-svg" style={style}>
            <DotLoading color="currentColor" />
        </div>
    );
};
const BlockLoading = () => {
    const style = {
        fontSize: '30px',
        position: 'absolute',
        left: 0,
        width: '100%',
        height: '100%',
        top: 0,
        zIndex: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: APPNAME[hostname].loadingColor,
        backgroundColor: APPNAME[hostname].baseColor,
    };

    return (
        <div className="loading-svg" style={style}>
            <DotLoading color="currentColor" />
        </div>
    );
};
const HalfLoading = () => {
    const style = {
        fontSize: '30px',
        position: 'absolute',
        left: 0,
        width: '100%',
        height: '100%',
        top: 0,
        zIndex: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: APPNAME[hostname].loadingColor,
        backgroundColor: APPNAME[hostname].baseColor,
    };

    return (
        <div className="loading-svg" style={style}>
            <DotLoading color="currentColor" />
        </div>
    );
};

export { PageLoading, BlockLoading, HalfLoading };
