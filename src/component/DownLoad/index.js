import './index.scss';

import React, {
    Fragment,
    useCallback,
    useState,
    useEffect,
    useRef,
} from 'react';
import { DownloadWeChaTips } from '@/component/DownloadWeChaTips';

import borwer from 'ox-util/src/browser';
import { APPNAME } from '@/utility/appName';
import openInstall from '@/utility/openinstall';

const hostname = window.location.hostname;
const appname = APPNAME[hostname].appname;
const logo = APPNAME[hostname].logo;

const Download = () => {
    let [showTip, setShowTip] = useState(false);
    var openInstallRef = useRef(null);

    const downweChatFn = useCallback(() => {
        if (borwer.iswechat()) {
            setShowTip(true);
        } else {
            if (openInstallRef.current) {
                openInstallRef.current.wakeupOrInstall();
            }
        }
    }, []);
    useEffect(() => {
        openInstall({
            channelCode: '8888',
            extraParam: {
                spage: '1',
                spageid: '90708034',
                router: '',
            },
        }).then((oi) => {
            openInstallRef.current = oi;
            // oi.schemeWakeup();
        });
    }, []);
    return (
        <Fragment>
            <div className="down-comp">
                <div className="down-logo">
                    <div className="logo-icon">
                        <img src={logo} alt="" />
                    </div>
                    <div className="logo-text">{appname}</div>
                </div>
                <div className="down-btn-open" onClick={downweChatFn}>
                    立即打开
                </div>
                <div className="down-btn-d" onClick={downweChatFn}>
                    立即下载
                </div>
                <div className="down-comp-tip">
                    若您已安装APP，请点击“立即打开”
                    若您未安装APP，请点击“立即下载”
                </div>
            </div>
            {showTip && <DownloadWeChaTips />}
        </Fragment>
    );
};

export { Download };
