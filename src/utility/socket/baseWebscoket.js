import pako from 'pako';
import WebSocket from './websocket';
import { Timer } from 'ox-util/src/timer';

const HEARTBEAT_INTERVAL = 16 * 1000;
const TIMEOUT = 8 * 1000;

const TIMER_HEARTBEAT = 'heartbeat';
const TIMER_TIMEOUT = 'timeout';
const TIMER_DO_LOGIN = 'dologin';

const COMMAND_SEND_MESSAGE = 'sendmessage';
const HEARTBEAT_CODE = 'y8vPLwAA';

const EVENT_DEBUG_LOG = 'debug-log';

class BaseWebSocket extends WebSocket {
    constructor(props) {
        super(props);
        this._timer = new Timer();
        this._logined = false;
        this._loginData = null;
        this._param = {};
        this._loginFailCount = 0;
        this._sendMessage = [];
        this._lastReceiveTime = 0;
        this._startLoginTime = 0;
        this.doLogin = this.doLogin.bind(this);
        this.heartbeat = this.heartbeat.bind(this);
        this.doTimeout = this.doTimeout.bind(this);

        // Add this event hanlder ASAP, cause of we change value of this._logined
        // to true in the handler, and if this._logined is false we can't send
        // anything to web socket server.
    }
    // Should OVERWRITE and return a Promise Object.
    getAddressPool() {}

    // Should OVERWRITE and return a socket address.
    getAddress() {}

    // Should OVERWRITE.
    onReceiveMessage(data) {}

    onMessage(event) {
        var msg = event.data;
        var data = this.explode(msg);

        this._lastReceiveTime = Date.now();
        if (data.command == 'receivemessage') {
            data.content =
                data.enc == 'yes'
                    ? this.decode(data.content)
                    : atob(data.content);
            this.debugLog({ msg: 'Receive Message: \n' + data.content });
            data.content = JSON.parse(data.content);
            this.onReceiveMessage(data.content);
        } else if (data.command == 'result') {
            this._sendMessage.pop();
            // There are four content value if receive result command:
            // - login.success
            // - login.failed
            // - send.success
            // - send.failed
            this.emit(data.content, data);
        }

        this.emit('message', data.command, data.content);
    }

    login({ data = {}, param = {} }) {
        this._loginData = data;
        this._param = param;
        this.on('login.success', this.onLoginSuccess);
        this.on('login.failed', this.onLoginFailed);
        this.on('open', this.openHandler);
        this.on('close', this.closeHandler);
        this.on('error', this.errorHandler);

        this.getAddressPool().then(this.doLogin);
    }

    sendMsg(type, content) {
        var args;
        var strData = JSON.stringify({
            t: type,
            content: content,
            ic: 'h5',
        });

        this.debugLog({ msg: 'Send: \n' + strData, styleFlag: 'color:blue' });

        args = [
            'command=' + COMMAND_SEND_MESSAGE,
            'content=' + this.encode(strData),
        ];
        this.convey(args);
    }

    convey(args) {
        // Don't send anything before login success.
        if (this._logined || args[0] == 'command=login') {
            var msg = this.implode(args);
            this._sendMessage.push([msg, Date.now()]);
            this.send(msg);
        }
    }

    implode(ar) {
        ar.push('');
        return ar.join('\r\n');
    }

    explode(msg) {
        var lines = msg.split('\r\n');
        var result = {};

        lines.reduce((ret, item) => {
            if (item && item.indexOf('=') > -1) {
                var [k, v] = item.split('=');
                ret[k] = v;
            }
            return ret;
        }, result);

        return result;
    }

    decode(str) {
        var binaryString = this.base64Decode(str);
        var uint8Array = new Uint8Array(binaryString.length);
        var inflatedBuffer;

        for (var i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }
        inflatedBuffer = pako.inflate(uint8Array, {
            level: 6,
            raw: true,
        });

        return new TextDecoder().decode(inflatedBuffer);
    }

    encode(str) {
        var utf8UnitArray = new TextEncoder().encode(str);
        var binaryString = String.fromCharCode.apply(
            null,
            pako.deflate(utf8UnitArray, {
                level: 6,
                raw: true,
            }),
        );

        return this.base64Encode(binaryString);
    }

    base64Encode(binaryString) {
        var result = self.btoa(binaryString);

        return result.replace(/\+|\/|=/g, function (c) {
            switch (c) {
                case '+':
                    return '(';
                case '/':
                    return ')';
                case '=':
                    return '@';
            }
        });
    }

    base64Decode(str) {
        str = str.replace(/\(|\)|@/g, function (c) {
            switch (c) {
                case '(':
                    return '+';
                case ')':
                    return '/';
                case '@':
                    return '=';
            }
        });
        return self.atob(str);
    }

    close() {
        this.debugLog({
            msg: 'Manually Close ' + this.collectUnsendMsg(),
            styleFlag: 'color:red',
        });
        this._timer.clearAll();
        this._logined = false;
        this._sendMessage = [];
        this.removeAllListeners('login.failed');
        this.removeAllListeners('open');
        this.removeAllListeners('close');
        this.removeAllListeners('error');
        this.removeAllListeners('login.success');
        this.removeAllListeners();
        this.destroyCore();
        this.cleanQueue();
    }

    debugLog({ msg, toServer = false, styleFlag }) {
        if (process.env.NODE_ENV === 'development') {
            let consoleMsg = '[' + this.url + '] ' + msg;
            console.log(
                styleFlag ? '%c' + consoleMsg : consoleMsg,
                styleFlag || '',
            );
        }

        this.emit(EVENT_DEBUG_LOG, {
            url: this.url,
            msg,
            toServer,
            styleFlag,
        });
    }

    doLogin() {
        var loginData = this._loginData;
        var address = this.getAddress();
        var data = Object.keys(loginData).map((k) => {
            return k + '=' + loginData[k];
        });

        data.unshift('command=login');
        this._timer.clear(TIMER_DO_LOGIN);
        this._timer.set(TIMER_TIMEOUT, this.doTimeout, TIMEOUT);
        this._startLoginTime = Date.now();
        this.connect(address);
        this.convey(data);
        this.debugLog({
            msg:
                this._loginFailCount +
                'th login to: ' +
                address +
                '\n' +
                data.join('\r\n'),
        });
    }

    heartbeat() {
        this.convey([
            'command=' + COMMAND_SEND_MESSAGE,
            'content=' + HEARTBEAT_CODE,
        ]);
        this.debugLog({ msg: 'Send heartbeat', styleFlag: 'color:#666' });
        this._timer.set(TIMER_HEARTBEAT, this.heartbeat, HEARTBEAT_INTERVAL);
    }

    doTimeout() {
        this.debugLog({
            msg: 'Timeout (' + TIMEOUT + 'ms)',
            styleFlag: 'color:red',
        });
        this.destroyCore();
        this.report(false, 'Timeout');
        this.retryLogin();
    }

    retryLogin() {
        // Why use setTimeout?
        // After user's network broken, onerror and onclose perform one by one
        // that makes perform doLogin twice.
        if (!this._timer.get(TIMER_DO_LOGIN)) {
            this._timer.clear(TIMER_HEARTBEAT);
            this._timer.clear(TIMER_TIMEOUT);
            this._logined = false;
            this._loginFailCount++;
            this._timer.set(
                TIMER_DO_LOGIN,
                this.doLogin,
                this._loginFailCount * 1200,
            );
        }
    }

    onLoginSuccess() {
        this.debugLog({
            msg: '[SOCKET_SUCCESS] Login Success',
            toServer: true,
        });
        this._logined = true;
        this._loginFailCount = 0;
        this._timer.clear(TIMER_TIMEOUT);
        this._timer.set(TIMER_HEARTBEAT, this.heartbeat, 1000);
        this.report(true);
    }

    onLoginFailed() {
        this.debugLog({ msg: 'Login Fail', styleFlag: 'color:red' });
        this.report(false, 'Login Fail');
        this.retryLogin();
    }

    openHandler(event) {
        this.debugLog({ msg: 'Opened.' });
    }

    closeHandler(event) {
        this.debugLog({
            msg:
                '[SOCKET_FAILED] Unexpected Closed ' +
                JSON.stringify({
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean,
                }) +
                this.collectUnsendMsg(),
            toServer: true,
            styleFlag: 'color:red',
        });
        this._sendMessage = [];
        this.report(false, 'Unexpected Closed');
        this.retryLogin();
    }

    errorHandler(event) {
        this.debugLog({ msg: 'Error.', styleFlag: 'color:red' });
        this.report(false, 'Error');
        this.retryLogin();
    }

    collectUnsendMsg() {
        var sendMsg = this._sendMessage;
        var lastReceiveTime = this._lastReceiveTime;

        if (sendMsg[0] && sendMsg[0][1] < lastReceiveTime) {
            var symbol = 'kai';
            if (
                sendMsg.some(
                    (i) => i[0].indexOf('content=' + HEARTBEAT_CODE) < 0,
                )
            ) {
                symbol = 'gang';
            }
            return ' ' + symbol + ': ' + JSON.stringify(sendMsg);
        }
        return '[]';
    }

    report(isSuccess, reason) {}
}

export default BaseWebSocket;
