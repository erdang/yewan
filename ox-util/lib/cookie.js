"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var doc = document;
var _default = {
  _createCookieString: function _createCookieString(name, value, encode) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var text = name + '=' + (encode ? encodeURIComponent(value) : value);
    var expires = options.expires;
    var domain = options.domain;
    var path = options.path || '/';

    if (expires instanceof Date) {
      text += ';expires=' + expires.toUTCString();
    }

    if (domain) {
      text += ';domain=' + domain;
    }

    if (path) {
      text += ';path=' + path;
    }

    if (options.secure === true) {
      text += ';secure';
    }

    return text;
  },
  _parseCookieString: function _parseCookieString(text, decode) {
    var result = null;

    if (text) {
      var cookies = {};
      var cookiePark = text.split(/;\s/g);
      var cookieNameValue;

      for (var i = 0; i < cookiePark.length; i++) {
        cookieNameValue = cookiePark[i].split('=');
        cookies[cookieNameValue[0]] = decode ? decodeURIComponent(cookieNameValue[1]) : cookieNameValue[1];
      }

      result = cookies;
    }

    return result;
  },
  get: function get(name) {
    var cookies = this._parseCookieString(doc.cookie, true);

    if (cookies && cookies[name] !== undefined) {
      return cookies[name];
    }

    return null;
  },
  set: function set(name, value, options) {
    var text = this._createCookieString(name, value, true, options);

    doc.cookie = text;
  },
  remove: function remove(name) {
    var text = this._createCookieString(name, '', false, {
      expires: new Date(0)
    });

    doc.cookie = text;
  }
};
exports["default"] = _default;