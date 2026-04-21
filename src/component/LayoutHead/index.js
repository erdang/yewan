import './index.scss';

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const LayoutHead = (props) => {
    let native = useNavigate();
    const gobackFn = useCallback(() => {
        //console.log(window.history.length);
        props.num ? native('/home') : window.history.go(-1);
    }, [props, native]);
    return (
        <div className="layout-head">
            <div className="back-btn" onClick={gobackFn}>
                <svg
                    t="1647335345972"
                    className="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2204"
                >
                    <path
                        d="M670.608974 895.066254c-7.776956 0-15.656241-2.865194-21.795943-8.697911L298.645348 555.745378c-6.344359-6.037374-9.925852-14.325972-9.925852-23.023883 0-8.697911 3.581493-17.088838 9.925852-23.023883l350.167683-330.725292c12.688718-12.074748 32.847407-11.460777 44.819826 1.330269 12.074748 12.688718 11.460777 32.847407-1.330269 44.819826L366.693714 532.619167l325.711202 307.599081c12.688718 12.074748 13.302688 32.131108 1.330269 44.819826C687.493155 891.791746 678.9999 895.066254 670.608974 895.066254z"
                        p-id="2205"
                    ></path>
                </svg>
            </div>
            <div className="head-title">{props.title}</div>
        </div>
    );
};

export default LayoutHead;
