"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = addcommma;
var reg = /(\d+)(\d{3})/;

function addcommma(num) {
  num += '';

  while (reg.test(num)) {
    num = num.replace(reg, '$1,$2');
  }

  return num;
}