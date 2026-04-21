import axios from 'axios';
import { Dialog } from 'antd-mobile';
import Qs from 'qs';
import { appGate } from '@/utility/appGate';
import { APPNAME } from '@/utility/appName';
import user from '@/utility/user';
// import { captureException } from '@/utility/errorInit';

// const devMode = process.env.NODE_ENV !== 'production';
const hostname = window.location.hostname;
const TIMEOUT = 30 * 1000;
const TIMEOUT_PIC = 30 * 1000; //移动端上传图片 时间短 图片大 无法上传

// let hostDev = [
//     'dev-h5.yuewankeji.top',
//     'localhost',
//     'h5.yuewankeji.top',
//     'pre-h5.yuewankeji.top',
// ];

//suerdev.v.6.cn
// axios.defaults.withCredentials = devMode ? false : true;
//hostDev.includes(hostname) ? false : true
//cons
axios.defaults.withCredentials = false;
//跨域 是否需要携带凭证
const instance = axios.create({
    baseURL: APPNAME[hostname].proBaseURL,
    timeout: TIMEOUT,
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
});

//http://suerdev-user.v.6.cn/
const instanceUser = axios.create({
    baseURL: APPNAME[hostname].proBaseURL_USER,
    timeout: TIMEOUT,
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
});

//http://suerdev-pic.v.6.cn
const instancePic = axios.create({
    baseURL: APPNAME[hostname].proBaseURL_PIC,
    timeout: TIMEOUT_PIC,
});

const instanceGift = axios.create({
    baseURL: APPNAME[hostname].proBaseURL,
    timeout: TIMEOUT,
    withCredentials: false,
});
const instanceBili = axios.create({
    baseURL: 'https://api.live.bilibili.com',
    timeout: TIMEOUT,
    withCredentials: false,
});
const instanceGame = axios.create({
    baseURL: APPNAME[hostname].gameUrl,
    timeout: TIMEOUT,
    withCredentials: false,
});

const CODE_MESSAGE = {
    200: '服务器成功返回请求数据',
    201: '新建或修改数据成功',
    202: '一个请求已经进入后台排队(异步任务)',
    204: '删除数据成功',
    400: '发出信息有误',
    401: '用户没有权限(令牌失效、用户名、密码错误、登录过期)',
    402: '前端无痛刷新token',
    403: '用户得到授权，但是访问是被禁止的',
    404: '访问资源不存在',
    406: '请求格式不可得',
    410: '请求资源被永久删除，且不会被看到',
    500: '服务器发生错误',
    502: '网关错误',
    503: '服务不可用，服务器暂时过载或维护',
    504: '网关超时',
};

const T_FLAG = [
    '/api/v1/user/getUserInfo',
    '/api/v1/guild/apply',
    '/api/v1/guild/memberJoin',
];

const makeError = (error) => {
    // captureException(error);

    const { response } = error;
    let errMsg = '';
    if (response !== undefined) {
        const { status, statusText } = response;
        errMsg = CODE_MESSAGE[status] ? CODE_MESSAGE[status] : statusText;
    }
    Dialog.clear();
    Dialog.alert({
        content: response === undefined ? '网络错误，请重试' : errMsg,
        confirmText: '确定',
        onConfirm: () => {},
    });
    return Promise.reject(response === undefined ? error : errMsg);
};

const handleResponse = (res) => {
    // console.log(res);
    if (res.data.code === '200') {
        return res.data;
    } else if (res.data.code === '403') {
        user.toLogin();
        // return res.data;
    } else if (res.data.code === '405' && appGate.inApp()) {
        appGate.openPayPage({ amount: 0, title: '' });
        return res.data;
    } else {
        Dialog.clear();
        if (!T_FLAG.includes(res.config.url)) {
            Dialog.alert({
                content: res.data.message,
                confirmText: '确定',
                onConfirm: () => {},
            });
        }

        return res.data;
    }
};

//添加拦截
instance.interceptors.request.use(
    (config) => {
        if (config.method === 'post') {
            let token = config.data.token ? { token: config.data.token } : {};
            config.headers = {
                ...token,
                'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8',
            };
            config.data = Qs.stringify(config.data);
        } else {
            let tokenv = config.params.token
                ? { token: config.params.token }
                : {};

            config.headers = {
                ...tokenv,
            };
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
        //throw Error(error);
    },
);

instance.interceptors.response.use(
    (res) => {
        return handleResponse(res);
    },
    (error) => {
        return makeError(error);
    },
);

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
const get = function (url, params = {}) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params,
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

const post = function (url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, Qs.stringify(data)).then(
            (response) => {
                //关闭进度条
                resolve(response.data);
            },
            (err) => {
                reject(err);
            },
        );
    });
};

//user

//添加拦截
instanceUser.interceptors.request.use(
    (config) => {
        if (config.method === 'post') {
            let token = config.data.token ? { token: config.data.token } : {};
            config.headers = {
                ...token,
                'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8',
            };
            config.data = Qs.stringify(config.data);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

instanceUser.interceptors.response.use(
    (res) => {
        if (res.data.code === '200') {
            return res.data;
        } else if (res.data.code === '203') {
            user.toLogin();
            return res.data;
        } else {
            Dialog.alert({
                content: res.data.message,
                confirmText: '确定',
                onConfirm: () => {
                    console.log('Confirmed');
                },
            });
            return res.data;
        }
    },
    (error) => {
        return makeError(error);
    },
);

//pic

//添加拦截
instancePic.interceptors.request.use(
    (config) => {
        config.headers = {
            token: localStorage.getItem('ticket'),
        };
        if (config.method === 'put') {
            config.headers['Content-Type'] =
                config.data.type || 'application/octet-stream';
        }

        return config;
    },
    () => {},
);
instancePic.interceptors.response.use(
    (res) => {
        if (res.data.code === '200') {
            return res.data;
        } else if (res.data.code === '203') {
            user.toLogin();
            return res.data;
        } else {
            if (!res.config.url.includes('shellparty.oss')) {
                Dialog.alert({
                    content: res.data.message,
                    confirmText: '确定',
                    onConfirm: () => {
                        console.log('Confirmed');
                    },
                });
            }

            return res.data;
        }
    },
    (error) => {
        return makeError(error);
    },
);

//instanceGift
instanceGift.interceptors.request.use(
    (config) => {
        if (config.method === 'post') {
            config.headers = {
                encpass: config.data.encpass,
                'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8',
            };
            config.data = Qs.stringify(config.data);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

instanceGift.interceptors.response.use(
    (res) => {
        return res.data;
    },
    (error) => {
        return makeError(error);
    },
);

instanceGame.interceptors.request.use(
    (config) => {
        if (config.method === 'post') {
            let token = config.data.token ? { token: config.data.token } : {};
            config.headers = {
                ...token,
                'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8',
            };
            config.data = Qs.stringify(config.data);
        } else {
            let tokenv = config.params.token
                ? { token: config.params.token }
                : {};

            config.headers = {
                ...tokenv,
            };
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
        //throw Error(error);
    },
);

instanceGame.interceptors.response.use(
    (res) => {
        return handleResponse(res);
    },
    (error) => {
        return makeError(error);
    },
);

export {
    instanceUser,
    post,
    get,
    instancePic,
    instanceGift,
    instanceBili,
    instanceGame,
};

export default instance;
