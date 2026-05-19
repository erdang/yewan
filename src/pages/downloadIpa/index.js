import './index.scss';

import React, { useEffect } from 'react';
//import instance from '../../request/index';
import setTitle from '@/utility/settitle';
import borwer from 'ox-util/src/browser';
import { DownloadWeChaTips } from '@/component/DownloadWeChaTips';
import urlTool from 'ox-util/src/url';
import { APPNAME } from '@/utility/appName';
const searchParam = urlTool.param(window.location.search);
const hostname = window.location.hostname;
const DownloadIpa = () => {
    useEffect(() => {
        setTitle('椰壳 ');
    }, []);

    return (
        <div className="download-ipa">
            {borwer.iswechat() && <DownloadWeChaTips />}

            <div className="top"></div>
            <div className="ipa">
                <div className="log-ipa"></div>
                <div className="title">椰壳 </div>
            </div>
            {borwer.isandroid() ? (
                <div className="btn-a">
                    <a
                        href={
                            APPNAME[hostname].proBaseURL +
                            '/api/v1/app/appDownloads?channel=' +
                            (searchParam.channel || 112)
                        }
                    >
                        立即安装
                    </a>
                </div>
            ) : (
                <div className="btn-a">
                    <a
                        href={
                            'https://apps.apple.com/cn/app/%E6%A4%B0%E5%A3%B3/id6762315626'
                        }
                    >
                        立即安装
                    </a>
                </div>
            )}
        </div>
    );
};

export default DownloadIpa;
