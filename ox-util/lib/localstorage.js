"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Storage = exports.sessionStorage = exports.localStorage = void 0;

var _cookie = _interopRequireDefault(require("./cookie.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Storage = /*#__PURE__*/function () {
  function Storage(session) {
    _classCallCheck(this, Storage);

    this._session = !!session;
  }

  _createClass(Storage, [{
    key: "setItem",
    value: function setItem(key, value) {
      // @see http://chrisberkhout.com/blog/localstorage-errors/
      try {
        this._getStorage().setItem(key, value);
      } catch (e) {
        var option = {};

        if (!this._session) {
          option.expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        }

        this._getCookie().set(key, value, option);
      }
    }
  }, {
    key: "getItem",
    value: function getItem(key) {
      return this._getStorage().getItem(key) || this._getCookie().get(key) || '';
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      this._getStorage().removeItem(key);

      this._getCookie().remove(key);
    }
  }, {
    key: "_getStorage",
    value: function _getStorage() {
      return this._session ? self.sessionStorage : self.localStorage;
    }
  }, {
    key: "_getCookie",
    value: function _getCookie() {
      return _cookie["default"];
    }
  }]);

  return Storage;
}();

exports.Storage = Storage;
var localStorage = new Storage();
exports.localStorage = localStorage;
var sessionStorage = new Storage(true);
exports.sessionStorage = sessionStorage;
var _default = localStorage;
exports["default"] = _default;