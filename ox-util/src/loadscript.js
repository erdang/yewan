export default function loadScript(src) {
    var resolve;
    var reject;
    var promiseConstructor = function (res, rej) {
        resolve = res;
        reject = rej;
    };
    // @see http://www.quirksmode.org/dom/events/load.html
    var onload = function () {
        resolve(src);
        onload = onerror = promiseConstructor = null;
    };
    // @see http://www.quirksmode.org/dom/events/error.html
    var onerror = function () {
        reject(new Error("Can't load " + src));
        onload = onerror = promiseConstructor = null;
    };
    var script = document.createElement('script');
    var promise = new Promise(promiseConstructor);

    script.onload = onload;
    script.onerror = onerror;
    script.src = src;
    document.head.appendChild(script);

    return promise;
}
