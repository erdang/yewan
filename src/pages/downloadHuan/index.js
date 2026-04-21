import './index.scss';

import React, { useEffect } from 'react';
//import instance from '../../request/index';
import setTitle from '@/utility/settitle';
import borwer from 'ox-util/src/browser';
import { DownloadWeChaTips } from '@/component/DownloadWeChaTips';
import urlTool from 'ox-util/src/url';

const searchParam = urlTool.param(window.location.search);

const DownloadIpa = () => {
    useEffect(() => {
        setTitle('椰壳星球');
    }, []);

    return (
        <div className="download-ipa">
            {borwer.iswechat() && <DownloadWeChaTips />}

            <div className="top"></div>
            <div className="ipa">
                <div className="log-ipa"></div>
                <div className="title">椰壳星球</div>
            </div>
            {borwer.isandroid() ? (
                <div className="btn-a">
                    <a
                        href={
                            'https://api.wuhanyunyi.top/api/v1/app/appDownloads?channel=' +
                            (searchParam.channel || 110114)
                        }
                    >
                        立即安装
                    </a>
                </div>
            ) : (
                <div className="btn-a">
                    <a
                        href={
                            'itms-services://?action=download-manifest&url=' +
                            encodeURIComponent(
                                'https://api.wuhanyunyi.top/api/v1/app/appDownloads?json=plist&channel=' +
                                    (searchParam.channel || 110113),
                            )
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
