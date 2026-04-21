import user from '@/utility/user.js';
const hostname = window.location.hostname;
const environment = {
    'h5.gxjiaman.com': 'www',
    localhost: 'loc',
    'dev-h5.gxjiaman.com': 'dev',
};

var Sentry = null;
var errorQueue = [];
var msgQueue = [];

function loadSentry() {
    if (Sentry !== null) {
        return Promise.resolve(Sentry);
    }
    return import(
        /* webpackChunkName: "sentry-browser-6.13.3" */
        '@sentry/browser'
    ).then((m) => {
        Sentry = m;
        Sentry.init({
            dsn: 'https://6f117a5295ca4af39b55fd23d28fe3d8@appsentry.6.cn/26',
            environment: environment[hostname],
            tracesSampleRate: 1.0,
            release: '002',
            integrations: [
                new Sentry.Integrations.GlobalHandlers({
                    onerror: true,
                    onunhandledrejection: true,
                }),
            ],
        });

        let userinfo = user.userInfo && JSON.parse(user.userInfo);

        if (userinfo && userinfo.id) {
            console.log(userinfo.id);
            Sentry.setUser({
                id: userinfo.id,
                username: userinfo.alias,
            });
        }

        if (errorQueue.length > 0) {
            var err;
            while ((err = errorQueue.shift())) {
                Sentry.captureException(err);
            }
        }
        if (msgQueue.length > 0) {
            var msg;
            while ((msg = msgQueue.shift())) {
                Sentry.captureMessage(msg);
            }
        }
        return Sentry;
    });
}

export function captureException(err) {
    if (Sentry !== null) {
        return Sentry.captureException(err);
    }
    errorQueue.push(err);
}

export function captureMessage(msg) {
    if (Sentry !== null) {
        return Sentry.captureMessage(msg);
    }
    msgQueue.push(msg);
}

window.addEventListener('DOMContentLoaded', () => {
    process.env.NODE_ENV !== 'development' && requestAnimationFrame(loadSentry);
});
