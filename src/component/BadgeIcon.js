import React from 'react';
import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;

let icon = APPNAME[hostname].staticUrl;

const BadgeIcon = ({ level, fromStyle }) => {
    let style = {
        width: '8.2vw',
        height: '3.4vw',
        backgroundImage: `url('${icon}/level/${level}.png')`,
        backgroundSize: '100% 100%',
        display: 'inline-block',
    };
    return <div className="level-icon" style={style}></div>;
};

export { BadgeIcon };
