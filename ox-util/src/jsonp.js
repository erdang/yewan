import urltool from './url.js';

export default function jsonp(url, option = {}) {
    var resolve;
    var reject;
    var callbackName = option.callback || '__jsonp' + Date.now().toString(32);
    var promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    var script = document.createElement('script');
    var callback = function (data) {
        resolve(data);
    };

    script.src = urltool.make(url, {
        callback: callbackName
    });
    window[callbackName] = callback;
    document.head.appendChild(script);

    promise.abort = function () {
        window[callbackName] = function () {};
        reject(new Error('Abort jsonp ' + url));
    };

    return promise;
}
