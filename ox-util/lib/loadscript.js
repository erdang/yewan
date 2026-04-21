"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = loadScript;

function loadScript(src) {
  var resolve;
  var reject;

  var promiseConstructor = function promiseConstructor(res, rej) {
    resolve = res;
    reject = rej;
  }; // @see http://www.quirksmode.org/dom/events/load.html


  var _onload = function onload() {
    resolve(src);
    _onload = _onerror = promiseConstructor = null;
  }; // @see http://www.quirksmode.org/dom/events/error.html


  var _onerror = function onerror() {
    reject(new Error("Can't load " + src));
    _onload = _onerror = promiseConstructor = null;
  };

  var script = document.createElement('script');
  var promise = new Promise(promiseConstructor);
  script.onload = _onload;
  script.onerror = _onerror;
  script.src = src;
  document.head.appendChild(script);
  return promise;
}