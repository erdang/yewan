"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Timer = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DEFAULT_KEY = 'timer';

var Timer = /*#__PURE__*/function () {
  function Timer() {
    _classCallCheck(this, Timer);

    this._timerHolder = {};
  }

  _createClass(Timer, [{
    key: "get",
    value: function get() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_KEY;
      return this._timerHolder[key];
    }
  }, {
    key: "set",
    value: function set(key, func, time) {
      if (arguments.length == 2) {
        time = func;
        func = key;
        key = DEFAULT_KEY;
      }

      if (this.get(key)) {
        this.clear(key);
      }

      return this._timerHolder[key] = setTimeout(func, time);
    }
  }, {
    key: "clear",
    value: function clear() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_KEY;
      clearTimeout(this.get(key));
      delete this._timerHolder[key];
    }
  }, {
    key: "clearAll",
    value: function clearAll() {
      var keys = Object.keys(this._timerHolder);

      for (var i = 0; i < keys.length; i++) {
        this.clear(keys[i]);
      }
    }
  }]);

  return Timer;
}();

exports.Timer = Timer;

var _default = new Timer();

exports["default"] = _default;