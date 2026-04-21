"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _events = _interopRequireDefault(require("events"));

var _oop = require("ox-util/lib/oop.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var CONNECTING = 0;
var OPEN = 1;
var CLOSING = 2;
var CLOSED = 3;

var WebSocket = function WebSocket(url, protocol) {
  WebSocket.superclass.constructor.call(this);
  this.onOpen = this.onOpen.bind(this);
  this.onClose = this.onClose.bind(this);
  this.onMessage = this.onMessage.bind(this);
  this.onError = this.onError.bind(this);
  this._core = null;
  this._queue = [];

  if (url) {
    this.connect(url, protocol);
  }
};

(0, _oop.extend)(WebSocket, _events["default"], {
  connect: function connect(url, protocol) {
    if ('WebSocket' in self) {
      if (this._core) {
        this.cleanQueue();
        this.destroyCore();
      }

      var ws = protocol ? new self.WebSocket(url, protocol) : new self.WebSocket(url);
      ws.onopen = this.onOpen;
      ws.onclose = this.onClose;
      ws.onmessage = this.onMessage;
      ws.onerror = this.onError;
      this.url = ws.url;
      this.protocol = ws.protocol;
      this._core = ws;
    } else {
      this.emit('nonsupport');
    }
  },
  send: function send(msg) {
    if (this.isOpen()) {
      this._core.send(msg);

      this.emit('send', msg);
    } else {
      this._queue.push(msg);
    }
  },
  close: function close() {
    this.destroyCore();
    this.cleanQueue();
  },
  sendQueue: function sendQueue() {
    var queue = this._queue;
    var data;

    while (data = queue.shift()) {
      this._core.send(data);

      this.emit('send', data);
    }
  },
  destroyCore: function destroyCore() {
    var core = this._core;

    if (core) {
      core.onopen = core.onmessage = core.onclose = core.onerror = null;
      core.close();
      this._core = null;
    }
  },
  cleanQueue: function cleanQueue() {
    this._queue = [];
  },
  onOpen: function onOpen(event) {
    this.emit('open', event);
    this.sendQueue();
  },
  onClose: function onClose(event) {
    this.emit('close', event);
  },
  onMessage: function onMessage(event) {
    this.emit('message', event.data, event);
  },
  onError: function onError(event) {
    this.emit('error', event);
  },
  isConnecting: function isConnecting() {
    return this._core && this._core.readyState == CONNECTING;
  },
  isOpen: function isOpen() {
    return this._core && this._core.readyState == OPEN;
  },
  isClosing: function isClosing() {
    return this._core && this._core.readyState == CLOSING;
  },
  isClosed: function isClosed() {
    return !this._core || this._core.readyState == CLOSED;
  }
});
var _default = WebSocket;
exports["default"] = _default;