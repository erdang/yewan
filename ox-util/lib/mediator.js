"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _events = _interopRequireDefault(require("events"));

var _oop = require("./oop.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Mediator = function Mediator() {
  Mediator.superclass.constructor.call(this);
};

(0, _oop.extend)(Mediator, _events["default"], {
  subscribe: function subscribe(channel, fn) {
    this.on(channel, fn);
  },
  unsubscribe: function unsubscribe(channel, fn) {
    if (fn) {
      this.removeListener(channel, fn);
    } else {
      this.removeAllListeners(channel);
    }
  },
  publish: function publish(channel) {
    this.emit.apply(this, [].slice.call(arguments, 0));
  }
});

var _default = new Mediator();

exports["default"] = _default;