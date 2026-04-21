"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.parseSecond = parseSecond;
exports.formatSecond = formatSecond;
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var fill = function fill(n) {
  return n < 10 ? '0' + n : n + '';
};

function format(time) {
  var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'y-m-d';
  var dateObj = new Date(time);
  var year = dateObj.getFullYear();
  var month = fill(dateObj.getMonth() + 1);
  var date = fill(dateObj.getDate());
  var hour = fill(dateObj.getHours());
  var minute = fill(dateObj.getMinutes());
  var second = fill(dateObj.getSeconds());
  return template.replace(/y|m|d|h|i|s/g, function (s) {
    switch (s) {
      case 'y':
        return year;

      case 'm':
        return month;

      case 'd':
        return date;

      case 'h':
        return hour;

      case 'i':
        return minute;

      case 's':
        return second;
    }
  });
}

function parseSecond(seconds) {
  var dateObj = new Date(seconds * 1000);
  var date = dateObj.getUTCDate() - 1;
  var hour = dateObj.getUTCHours();
  var minute = dateObj.getUTCMinutes();
  var second = dateObj.getUTCSeconds();
  return [date, hour, minute, second];
}

function formatSecond(seconds) {
  var  _parseSecond$slice = parseSecond(seconds).slice(0),
      _parseSecond$slice2 = _slicedToArray(_parseSecond$slice, 4),
      day = _parseSecond$slice2[0],
      hour = _parseSecond$slice2[1],
      minute = _parseSecond$slice2[2],
      second = _parseSecond$slice2[3];
  
  return (day ? day + '天' : '') + (hour ? fill(hour) + ':' : '') + fill(minute) + ':' + fill(second);
}

var _default = {
  format: format,
  parseSecond: parseSecond,
  formatSecond: formatSecond
};
exports["default"] = _default;