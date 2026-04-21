"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _oop = require("./oop.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var rurl = new RegExp([// protocal
/^(https?:)?(?:\/\/)?/, // domain or IP
/((?:[\d\w.-]+\.[a-z]{2,6}|[\d.]+))?/, // port
/(:\d+)?/, // pathname
/([^?#]+)?/, // search
/(\?[^#]*)?/, // hash
/(#.*)?$/].map(function (i) {
  return i.source;
}).join(''));
var _default = {
  rurl: rurl,
  parse: function parse(url) {
    var result;

    if (typeof url == 'string') {
      var matchobj = result = rurl.exec(url.replace(/@/g, '.').trim());

      if (matchobj) {
        var protocol = matchobj[1] || '';
        var hostname = matchobj[2] || '';
        var port = matchobj[3] ? matchobj[3].slice(1) : '';
        var host = hostname + (port ? ':' + port : '');
        var pathname = matchobj[4] || '';
        var search = !matchobj[5] || matchobj[5] == '?' ? '' : matchobj[5];
        var hash = !matchobj[6] || matchobj[6] == '#' ? '' : matchobj[6];
        var href = url;
        result = {
          protocol: protocol,
          hostname: hostname,
          port: port,
          host: host,
          pathname: pathname,
          search: search,
          hash: hash,
          href: href
        };
      }
    } else if (_typeof(url) == 'object') {
      result = '';

      if (url.protocol) {
        result = url.protocol + '//';
      } else if (url.hostname || url.host) {
        result += '//';
      }

      if (url.hostname) {
        result += url.hostname + (url.port ? ':' + url.port : '');
      } else if (url.host) {
        result += url.host;
      }

      result += url.pathname || '';
      result += url.search || '';
      result += url.hash || '';
    }

    return result;
  },
  make: function make(baseUrl, paramObj) {
    var baseUrlObj = this.parse(baseUrl);
    var baseParamObj = this.param(baseUrlObj.search);
    var paramStr = this.param((0, _oop.merge)(baseParamObj, paramObj));
    baseUrlObj.search = paramStr ? '?' + paramStr : '';
    return this.parse(baseUrlObj);
  },
  param: function param(arg) {
    var _this = this;

    var result;

    if (_typeof(arg) == 'object') {
      var params = [];
      Object.keys(arg).forEach(function (key) {
        var value = arg[key];

        if (typeof value !== 'undefined') {
          if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
              params.push(key + '[]=' + encodeURIComponent(value[i]));
            }
          } else {
            params.push(key + '=' + encodeURIComponent(value));
          }
        }
      });
      result = params.join('&');
    } else if (typeof arg == 'string') {
      arg = arg.indexOf('?') == 0 || arg.indexOf('#') == 0 ? arg.slice(1) : arg;
      result = {};

      if (arg) {
        arg.split('&').forEach(function (item, index) {
          var _item$split = item.split('='),
              _item$split2 = _slicedToArray(_item$split, 2),
              key = _item$split2[0],
              value = _item$split2[1];

          result[key] = _this.decode(value);
        });
      }
    }

    return result;
  },
  decode: function decode(str) {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      if (e.name == 'URIError') {
        return str;
      } else {
        throw e;
      }
    }
  }
};
exports["default"] = _default;