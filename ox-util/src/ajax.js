import urlTool from 'ox-util/lib/url.js';

function makeError(type, url = '', context = null, originalError = null) {
    var err = new Error(
        type +
            (url ? ': ' + url : url) +
            (originalError ? ': ' + originalError.toString() : '')
    );

    err.name = 'AjaxError';
    err.type = type;
    err.url = url;
    err.context = context;
    return err;
}

function getXHR() {
    return new XMLHttpRequest();
}

export function fetchRequest(
    url,
    {
        method = 'GET',
        data = null,
        dataType = 'json',
        timeout = 0,
        withCredentials = false,
        context = null
    } = {},
    /*FOR TEST*/ factory = {fetch: fetch, AbortController: AbortController}
) {
    var abortControl = new factory.AbortController();
    var initParam = {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        signal: abortControl.signal
    };
    var timer;
    var timeoutPromise;
    var fetchPromise;
    var result;

    function abort() {
        clearTimeout(timer);
        abortControl.abort();
    }

    if (withCredentials) {
        initParam.credentials = 'include';
    }
    if (method === 'POST' && data) {
        initParam.body = urlTool.param(data);
    } else if (data) {
        url = urlTool.make(url, data);
    }
    if (timeout > 0) {
        timeoutPromise = new Promise((resolve, reject) => {
            timer = setTimeout(function () {
                reject(makeError('TimeoutError', url, context));
                abort();
            }, timeout);
        });
    }
    fetchPromise = factory.fetch.call(self, url, initParam).then(
        (response) => {
            clearTimeout(timer);
            if (response.ok) {
                return (dataType === 'json'
                    ? response.json()
                    : dataType === 'blob'
                    ? response.blob()
                    : dataType === 'arraybuffer'
                    ? response.arrayBuffer()
                    : response.text()
                ).then((responseData) => {
                    return context
                        ? {context, response: responseData}
                        : responseData;
                });
            }
            throw makeError('HTTPError' + response.status, url, context);
        },
        (error) => {
            clearTimeout(timer);
            if (error.name === 'AbortError') {
                throw makeError('AbortedManuallyError', url, context, error);
            }
            throw makeError('NetworkError', url, context, error);
        }
    );

    result = Promise.race(
        timeoutPromise ? [timeoutPromise, fetchPromise] : [fetchPromise]
    );
    result.abort = abort;

    return result;
}

export function xhrRequest(
    url,
    {
        method = 'GET',
        data = null,
        dataType = 'json',
        timeout = 0,
        withCredentials = false,
        context = null
    } = {},
    /*FOR TEST*/ xhrFactory = getXHR
) {
    var xhr = xhrFactory();
    var resolve;
    var reject;
    var promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    var onComplete = function (event) {
        var status = this.status;
        var response = this.response;

        if (event.type == 'timeout') {
            reject(makeError('TimeoutError', url, context));
        } else if (event.type == 'error') {
            reject(makeError('NetworkError', url, context));
        } else if ((status >= 200 && status < 300) || status == 304) {
            if (response === null && dataType === 'json') {
                return reject(
                    makeError(
                        'ParseJSONError ' + this.responseText,
                        url,
                        context
                    )
                );
            }
            resolve(
                context
                    ? {
                          context,
                          response
                      }
                    : response
            );
        } else {
            reject(makeError('HTTPError' + status, url, context));
        }

        xhr = onComplete = null;
    };

    if (method != 'POST' && data) {
        url = urlTool.make(url, data);
    }
    xhr.open(method, url, true);
    xhr.timeout = timeout;
    xhr.withCredentials = withCredentials;
    xhr.responseType = dataType;
    xhr.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded; charset=UTF-8'
    );
    xhr.onload = xhr.onerror = xhr.ontimeout = onComplete;
    xhr.send(method == 'POST' && data ? urlTool.param(data) : null);

    promise.abort = function () {
        if (xhr) {
            xhr.abort();
            reject(makeError('AbortedManuallyError', url, context));
        }
    };

    return promise;
}

/**
 * Make a http request.
 * @param  {String} url
 * @param  {Object} opt
 *         method - POST or GET
 *         data - a object that can serialize by url.param method.
 *         dataType - xml, json or text
 *         timeout - time in milliseconds
 *         widthCredentials - CORS policy
 *         context - the context data, ** if you set context to some values,
 *             Promise's onFulfilled callback will receive the parameter like
 *             {response: response, context: context} otherwise just pure
 *             response data from XMLHttpRequest object. **
 * @param  {String} Which method takes priority. xhr or fetch?
 * @return {Promise}
 */
export default function ajax(url, opt, prior = 'xhr') {
    if (
        typeof XMLHttpRequest !== 'function' ||
        (prior === 'fetch' &&
            typeof fetch === 'function' &&
            typeof AbortController === 'function')
    ) {
        return fetchRequest(url, opt);
    }
    return xhrRequest(url, opt);
}
