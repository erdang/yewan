import './index.scss';

import React, { useCallback } from 'react';

import { connect } from 'react-redux';

import urlTool from 'ox-util/src/url';

import { appGate } from '@/utility/appGate.js';

const searchParam = urlTool.param(window.location.search);
const buildURL = function (url, params) {
    if (!params) {
        return url;
    }

    // params序列化过程略
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + params.join('&');

    return url;
};

var WeekStar = function ({ ticket }) {
    const openFull = useCallback(() => {
        let url = searchParam.href;
        let anc = buildURL(url, ['ruid=' + searchParam.ruid]);
        appGate.openUrl(anc, 'headless');
    }, []);
    return (
        <div className="paste">
            <div onClick={openFull}>
                <img src={searchParam.src} alt="" />
            </div>
        </div>
    );
};
function mapStateTpProps(state) {
    return { ...state.user };
}

const mapDispatchToProps = {};

export default connect(mapStateTpProps, mapDispatchToProps)(WeekStar);
