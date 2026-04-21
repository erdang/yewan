import EventEmitter from 'events';
import {extend} from 'ox-util/lib/oop.js';

const CONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;

var WebSocket = function (url, protocol) {
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

extend(WebSocket, EventEmitter, {
    connect(url, protocol) {
        if ('WebSocket' in self) {
            if (this._core) {
                this.cleanQueue();
                this.destroyCore();
            }

            var ws = protocol
                ? new self.WebSocket(url, protocol)
                : new self.WebSocket(url);

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

    send(msg) {
        if (this.isOpen()) {
            this._core.send(msg);
            this.emit('send', msg);
        } else {
            this._queue.push(msg);
        }
    },

    close() {
        this.destroyCore();
        this.cleanQueue();
    },

    sendQueue() {
        var queue = this._queue;
        var data;

        while ((data = queue.shift())) {
            this._core.send(data);
            this.emit('send', data);
        }
    },

    destroyCore() {
        var core = this._core;
        if (core) {
            core.onopen = core.onmessage = core.onclose = core.onerror = null;
            core.close();
            this._core = null;
        }
    },

    cleanQueue() {
        this._queue = [];
    },

    onOpen(event) {
        this.emit('open', event);
        this.sendQueue();
    },

    onClose(event) {
        this.emit('close', event);
    },

    onMessage(event) {
        this.emit('message', event.data, event);
    },

    onError(event) {
        this.emit('error', event);
    },

    isConnecting() {
        return this._core && this._core.readyState == CONNECTING;
    },

    isOpen() {
        return this._core && this._core.readyState == OPEN;
    },

    isClosing() {
        return this._core && this._core.readyState == CLOSING;
    },

    isClosed() {
        return !this._core || this._core.readyState == CLOSED;
    }
});

export default WebSocket;
