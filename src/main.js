import React from 'react';
import { createRoot } from 'react-dom/client';
import 'antd-mobile/es/global';
import App from './APP';

// import './utility/errorInit';
import ErrorBoundaries from './component/ErrorBoundaries';
// import { captureException } from '@/utility/errorInit';
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

let reactEle = '';

if (process.env.NODE_ENV !== 'production') {
    reactEle = (
        <ErrorBoundaries>
            <App />
        </ErrorBoundaries>
    );
} else {
    reactEle = (
        <ErrorBoundaries>
            <App />
        </ErrorBoundaries>
    );
}

window.addEventListener('unhandledrejection', (e) => {
    e.preventDefault();
    // captureException(e.reason);
    return true;
});
window.onerror = function (message, source, lineno, colno, error) {
    // captureException(message);
};

window.addEventListener(
    'error',
    (error) => {
        setTimeout(() => {
            console.log(error);
            //进来代表一定有错误 判断ErrorBoundary中是否已处理异常
            const flag = localStorage.getItem('ErrorBounary');
            if (flag) {
                //进入了ErrorBounary 错误已被处理 error事件不用处理该异常
                localStorage.setItem('ErrorBounary', false); //重置状态
            } else {
                //未进入ErrorBounary 代表此错误为异步错误/事件错误
                uploadError(error);
                // captureException(error.message);
            }
        });
    },
    true,
);

function uploadError(args) {
    // 过滤
    const info = {
        lineno: args.lineno,
        colno: args.colno,
        stack: args.error ? args.error.stack : '', //img 未加载 没有error
        timeStamp: args.timeStamp,
        message: args.message,
        filename: args.filename,
    };
    // const str = new Buffer(JSON.stringify(info)).toString("base64");
    const str = window.btoa(JSON.stringify(info));

    const host = window.location.origin + '/kotest';
    new Image().src = `${host}?info=${str}`;
}

createRoot(document.getElementById('app')).render(reactEle);
