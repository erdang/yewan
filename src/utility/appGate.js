import EventEmitter from 'events';
import { mix } from 'ox-util/src/oop.js';

// import { decode } from '../utility/crypto';

// import { Dialog } from 'antd-mobile';
// import VConsole from 'vconsole';

// // eslint-disable-next-line no-unused-vars
// const vConsole = new VConsole();

let callbackId = 1;
const callMethod = function (config) {
    // 通过JavaScriptChannel注入的全局对象
    let callbackName = '';
    //socket 需要一直存在 名字不能变
    if (config.method === 'appRegisterSocketMessage') {
        callbackName = '__native_callback_socket';
    } else {
        callbackName = `__native_callback_${callbackId++}`;
    }

    //const callbackName = `__native_callback_${callbackId++}`;
    // 注册全局回调函数
    if (typeof config.callback === 'function') {
        const callback = config.callback.bind(config);
        window[callbackName] = function (args) {
            callback(args);
            if (callbackName !== '__native_callback_socket') {
                delete window[callbackName];
            }
        };
    }
    config.callback = callbackName;
    console.log(JSON.stringify(config));
    // 通过JavaScriptChannel注入的全局对象
    if (window.AppSDK && window.AppSDK.postMessage) {
        window.AppSDK.postMessage(JSON.stringify(config));
    }
};

var appGate = new EventEmitter();

// H5 暴露给 App 的方法：App 可在 WebView 中按方法名直接调用
const registerAppMethod = (methodName, handler) => {
    if (!methodName || typeof handler !== 'function') {
        return () => {};
    }
    window[methodName] = (args) => {
        let payload = args;
        if (typeof args === 'string') {
            try {
                payload = JSON.parse(args);
            } catch (e) {
                // keep raw string payload
            }
        }
        handler(payload);
    };
    return () => {
        if (window[methodName]) {
            delete window[methodName];
        }
    };
};

// useEffect(() => {
//     const off = appGate.registerAppMethod('onAppPayResult', (payload) => {
//         console.log('app -> h5', payload);
//         // 这里写你的业务逻辑
//     });

//     return () => off(); // 或 appGate.unregisterAppMethod('onAppPayResult')
// }, []);

const unregisterAppMethod = (methodName) => {
    if (methodName && window[methodName]) {
        delete window[methodName];
    }
};

const openUrl = (url, type) => {
    let callback = (data) => {};
    callMethod({
        method: 'jsEntry',
        params: {
            method: 'requestRoute',
            param: {
                router: `router://ad/acivity/page/webview?url=${url}&type=${type}`,
            },
        },
        callback: callback,
    });
};
const openWebview = (url, type) => {
    let callback = (data) => {};
    callMethod({
        method: 'appRealName',
        params: {},
        callback: callback,
    });
};

const openPayPage = ({ amount = 0, title = '' }) => {
    let callback = (data) => {};
    callMethod({
        method: 'appPayNew',
        params: {
            amount: amount,
            title: title,
        },
        callback: callback,
    });
};
const openToPay = ({ money = 0, product_id = 'cao' }) => {
    return new Promise((reslove, reject) => {
        // VDcCK1E0U2sCYgw6UTcDNgxtW20LZVI(AmAIPFVrUzYNJlMrVjMHdVE1WmQPaQBjDWhTYwoyAWYAMQ5iBzBdMlQ6AjJRMFNtAmIMMFE1AzIMZ1trC2RSZAJsCDFVZVNvDTxTNFY0BzlRNVowDzwAOQ0(UzMKYwFn
        let callback = (data) => {
            reslove(data);
        };
        callMethod({
            method: 'appPay',
            params: {
                money: money,
                product_id: product_id,
            },
            callback: callback,
        });
    });
};
// sd 支付方式  商家充值支付渠道：1、支付宝 + 微信 2、银联的支付宝+微信 3、H5支付(微信H5 + 支付宝H5)
// maiType 选择支付渠道  支付宝，微信
const toAppPay = ({
    amount = 0,
    sd = '',
    maiType = '',
    h5 = '',
    coin = '',
    wak = '',
    sdv2 = '',
    sdv3 = '',
}) => {
    let callback = (data) => {};
    callMethod({
        method: 'appMai',
        params: {
            amount: amount,
            sd: sd,
            sdv2: sdv2,
            sdv3: sdv3,
            maiType: maiType,
            h5: h5,
            coin: coin,
            wak: wak,
        },
        callback: callback,
    });
};

const openRoom = (uid) => {
    let callback = (data) => {};
    callMethod({
        method: 'appWKEnterRoom',
        params: {
            uid,
        },
        callback: callback,
    });
};

const shareFn = ({ url = '', title = '', subtitle = '', thumb = '' }) => {
    let callback = (data) => {};
    callMethod({
        method: 'appShare',
        params: {
            url,
            title,
            subtitle,
            thumb,
        },
        callback: callback,
    });
};

const closeWeb = () => {
    let callback = (data) => {};
    callMethod({
        method: 'finish',
        params: {},
        callback: callback,
    });
};

const openProfileCard = (uid, type) => {
    let callback = (data) => {};
    callMethod({
        method: 'openProfileCard',
        params: {
            uid: uid,
            type: type,
        },
        callback: callback,
    });
};
const openProfilePage = (uid) => {
    let callback = (data) => {};
    callMethod({
        method: 'openProfilePage',
        params: {
            uid: uid,
        },
        callback: callback,
    });
};
const openIm = (uid, type) => {
    let callback = (data) => {};
    callMethod({
        method: 'openIm',
        params: {
            uid: uid,
            type: type,
        },
        callback: callback,
    });
};

const getTicket = () => {
    return new Promise((reslove, reject) => {
        // VDcCK1E0U2sCYgw6UTcDNgxtW20LZVI(AmAIPFVrUzYNJlMrVjMHdVE1WmQPaQBjDWhTYwoyAWYAMQ5iBzBdMlQ6AjJRMFNtAmIMMFE1AzIMZ1trC2RSZAJsCDFVZVNvDTxTNFY0BzlRNVowDzwAOQ0(UzMKYwFn
        let callback = (data) => {
            reslove(data);
        };
        callMethod({
            method: 'getEncpass',
            params: {},
            callback: callback,
        });
    });
};

const openGiftStore = ({ giftID = '', target = {} }) => {
    callMethod({
        method: 'openGiftStore',
        params: {
            giftID: giftID,
            target: target,
        },
        callback: '',
    });
};

const toLogin = () => {
    callMethod({
        method: 'appGuestLogin',
        params: {},
        callback: '',
    });
};
const CommonEvent = ({ method, param }) => {
    let newParam = JSON.stringify(param);
    return new Promise((reslove, reject) => {
        // console.log(newParam);
        let callback = (data) => {
            reslove(data);
        };
        callMethod({
            method: method,
            params: { param: newParam },
            callback: callback,
        });
    });
};

const sendMsg = function (type, data) {
    var msg;

    if (typeof data === 'object') {
        data.ak = '%$authkey$%';
    }
    msg = JSON.stringify({
        t: type,
        content: data,
        askId: 'h5_' + Date.now(),
    });
    callMethod({
        method: 'appSendSocketNew',
        params: {
            data: msg,
        },
        callback: '',
    });
};

const listen = function (...typeID) {
    return new Promise((reslove, reject) => {
        let callback = (data) => {
            console.log('h5-----' + data);

            let jData = data && JSON.parse(data);
            appGate.emit('msg', jData);
            reslove(jData);
        };
        callMethod({
            method: 'appRegisterSocketMessage',
            params: {
                typeID: typeID.join(),
            },
            callback: callback,
        });
    });
};

const GetPermission = (param) => {
    return new Promise((reslove, reject) => {
        console.log('appGate-------' + param.join());
        let callback = (data) => {
            reslove(data);
        };
        callMethod({
            method: 'appGetPermission',
            params: {
                param: param.join(),
            },
            callback: callback,
        });
    });
};
const IsHavePermission = (param) => {
    return new Promise((reslove, reject) => {
        let callback = (data) => {
            reslove(data);
        };
        callMethod({
            method: 'IsHaveAppPermission',
            params: {
                param: param.join(),
            },
            callback: callback,
        });
    });
};

const checkPlatform = (param) => {
    return new Promise((reslove, reject) => {
        //console.log(param.join());
        //reslove('0');
        let callback = (data) => {
            reslove(data);
        };
        callMethod({
            method: 'checkPlatform',
            params: {
                param: '',
            },
            callback: callback,
        });
    });
};

const inApp = () => {
    var ua = window.navigator.userAgent;
    return !/\s/g.test(ua);
};
const inAppAndroid = () => {
    // var ua = decode(window.navigator.userAgent);
    //console.log('appGate------' + ua);
    return inApp() && typeof window.webkit === 'undefined';
};

const inAppIOS = () => {
    // console.log(typeof window.webkit === 'object');
    // console.log(window.webkit + 'appgate');
    return inApp() && typeof window.webkit === 'object';
};

mix(appGate, {
    openUrl,
    openPayPage,
    openRoom,
    shareFn,
    closeWeb,
    openProfileCard,
    getTicket,
    openGiftStore,
    toLogin,
    listen,
    sendMsg,
    inAppAndroid,
    inAppIOS,
    inApp,
    GetPermission,
    IsHavePermission,
    checkPlatform,
    openIm,
    CommonEvent,
    toAppPay,
    openWebview,
    openProfilePage,
    openToPay,
    registerAppMethod,
    unregisterAppMethod,
});

export { callMethod, appGate };
