"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var now = Date.now();

function _default() {
  return (++now).toString(36);
}