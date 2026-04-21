"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchRequest = fetchRequest;
exports.xhrRequest = xhrRequest;
exports["default"] = ajax;

var _url = _interopRequireDefault(require("ox-util/lib/url.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function makeError(type) {
  var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var originalError = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var err = new Error(type + (url ? ': ' + url : url) + (originalError ? ': ' + originalError.toString() : ''));
  err.name = 'AjaxError';
  err.type = type;
  err.url = url;
  err.context = context;
  return err;
}

function getXHR() {
  return new XMLHttpRequest();
}

function fetchRequest(url) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$method = _ref.method,
      method = _ref$method === void 0 ? 'GET' : _ref$method,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? null : _ref$data,
      _ref$dataType = _ref.dataType,
      dataType = _ref$dataType === void 0 ? 'json' : _ref$dataType,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 0 : _ref$timeout,
      _ref$withCredentials = _ref.withCredentials,
      withCredentials = _ref$withCredentials === void 0 ? false : _ref$withCredentials,
      _ref$context = _ref.context,
      context = _ref$context === void 0 ? null : _ref$context;

  var factory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    fetch: fetch,
    AbortController: AbortController
  };
  var abortControl = new factory.AbortController();
  var initParam = {
    method: method,
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
    initParam.body = _url["default"].param(data);
  } else if (data) {
    url = _url["default"].make(url, data);
  }

  if (timeout > 0) {
    timeoutPromise = new Promise(function (resolve, reject) {
      timer = setTimeout(function () {
        reject(makeError('TimeoutError', url, context));
        abort();
      }, timeout);
    });
  }

  fetchPromise = factory.fetch.call(self, url, initParam).then(function (response) {
    clearTimeout(timer);

    if (response.ok) {
      return (dataType === 'json' ? response.json() : dataType === 'blob' ? response.blob() : dataType === 'arraybuffer' ? response.arrayBuffer() : response.text()).then(function (responseData) {
        return context ? {
          context: context,
          response: responseData
        } : responseData;
      });
    }

    throw makeError('HTTPError' + response.status, url, context);
  }, function (error) {
    clearTimeout(timer);

    if (error.name === 'AbortError') {
      throw makeError('AbortedManuallyError', url, context, error);
    }

    throw makeError('NetworkError', url, context, error);
  });
  result = Promise.race(timeoutPromise ? [timeoutPromise, fetchPromise] : [fetchPromise]);
  result.abort = abort;
  return result;
}

function xhrRequest(url) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$method = _ref2.method,
      method = _ref2$method === void 0 ? 'GET' : _ref2$method,
      _ref2$data = _ref2.data,
      data = _ref2$data === void 0 ? null : _ref2$data,
      _ref2$dataType = _ref2.dataType,
      dataType = _ref2$dataType === void 0 ? 'json' : _ref2$dataType,
      _ref2$timeout = _ref2.timeout,
      timeout = _ref2$timeout === void 0 ? 0 : _ref2$timeout,
      _ref2$withCredentials = _ref2.withCredentials,
      withCredentials = _ref2$withCredentials === void 0 ? false : _ref2$withCredentials,
      _ref2$context = _ref2.context,
      context = _ref2$context === void 0 ? null : _ref2$context;

  var xhrFactory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getXHR;
  var xhr = xhrFactory();
  var resolve;
  var reject;
  var promise = new Promise(function (res, rej) {
    resolve = res;
    reject = rej;
  });

  var _onComplete = function onComplete(event) {
    var status = this.status;
    var response = this.response;

    if (event.type == 'timeout') {
      reject(makeError('TimeoutError', url, context));
    } else if (event.type == 'error') {
      reject(makeError('NetworkError', url, context));
    } else if (status >= 200 && status < 300 || status == 304) {
      if (response === null && dataType === 'json') {
        return reject(makeError('ParseJSONError ' + this.responseText, url, context));
      }

      resolve(context ? {
        context: context,
        response: response
      } : response);
    } else {
      reject(makeError('HTTPError' + status, url, context));
    }

    xhr = _onComplete = null;
  };

  if (method != 'POST' && data) {
    url = _url["default"].make(url, data);
  }

  xhr.open(method, url, true);
  xhr.timeout = timeout;
  xhr.withCredentials = withCredentials;
  xhr.responseType = dataType;
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.onload = xhr.onerror = xhr.ontimeout = _onComplete;
  xhr.send(method == 'POST' && data ? _url["default"].param(data) : null);

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


function ajax(url, opt) {
  var prior = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'xhr';

  if (typeof XMLHttpRequest !== 'function' || prior === 'fetch' && typeof fetch === 'function' && typeof AbortController === 'function') {
    return fetchRequest(url, opt);
  }

  return xhrRequest(url, opt);
}