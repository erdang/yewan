"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  // Random pick a number of [a, b],
  // include a and do not include b.
  randrange: function randrange(a, b) {
    return a + Math.floor(Math.random() * (b - a));
  },
  // https://bost.ocks.org/mike/shuffle/
  shuffleArray: function shuffleArray(array) {
    var currentIndex = array.length;
    var temporary;
    var toIndex;

    while (currentIndex) {
      toIndex = Math.floor(Math.random() * currentIndex--);
      temporary = array[currentIndex];
      array[currentIndex] = array[toIndex];
      array[toIndex] = temporary;
    }

    return array;
  }
};
exports["default"] = _default;