"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = jsonp;

var _url = _interopRequireDefault(require("./url.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function jsonp(url) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var resolve;
  var reject;
  var callbackName = option.callback || '__jsonp' + Date.now().toString(32);
  var promise = new Promise(function (res, rej) {
    resolve = res;
    reject = rej;
  });
  var script = document.createElement('script');

  var callback = function callback(data) {
    resolve(data);
  };

  script.src = _url["default"].make(url, {
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