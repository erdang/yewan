import random from 'ox-util/src/random';
import BaseWebSocket from './baseWebscoket';
// import performanceFilter from 'utility/roomwebsocketperformancefilter.js';
import instance from '@/request/index';
import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;
class RoomWebSocket extends BaseWebSocket {
    constructor(props) {
        super(props);
        this._addressPool = [];
        this._addressPoolIndex = 0;
        this._authKey = '';
        this._waitQueue = [];
        this._onGlobalBatchMessage = this._onGlobalBatchMessage.bind(this);
    }
    getAddressPool() {
        var { uid } = this._loginData;
        return instance('/api/room/getSocketHost', {
            rid: uid,
        }).then((data) => {
            if (data.code == '001') {
                let pool = data.content.websock.map(
                    (i) =>
                        'wss://' +
                        i
                            .replace('xiu123.cn', '6rooms.com')
                            .replace(/:\d+$/, ''),
                );
                if (window.location.hostname === APPNAME[hostname].h5Url) {
                    // dev wss  ws
                    pool = data.content.websock.map((i) => 'wss://' + i);
                }
                this._addressPool = random.shuffleArray(pool);
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        'RoomWebSocket addressPool: ' +
                            JSON.stringify(this._addressPool),
                    );
                }
                return this._addressPool;
            }
            throw new Error(data.content);
        });
    }

    getAddress() {
        var pool = this._addressPool;
        var url = pool[this._addressPoolIndex++ % pool.length];

        if (
            window.location.hostname === APPNAME[hostname].h5Url ||
            /:\d+\/?$/.test(url)
        ) {
            return url;
        }
        return url + '/room' + ((Number(this._loginData.roomid) % 6) + 1);
    }

    onReceiveMessage(data) {
        if (data.code != '001') {
            this.emit('receiveerr', data);
            this.emit('receiveerr:' + data.code, data);
        } else {
            let content = data.content;

            this._emitReceiveEvent(content);

            // Room socket server ban any messages before authorize logined user
            // (push authKey to logined user). So we cache messages that users
            // send before authorized and dump it after got authKey.
            if (content.typeID == 408 || content.typeID == 404) {
                let userState = content.content['404']
                    ? content.content['404'].content
                    : content.content;
                this._authKey = userState.authKey;
                this._dumpWaitQueue();
            }
            // batch message
            if (content.typeID == 1413) {
                let list = content.content;

                for (let i = 0; i < list.length; i++) {
                    let item = list[i];
                    this._emitReceiveEvent(item);
                }
            }

            // batch _onGlobalBatchMessage by other way
            if (content.typeID == 416) {
                instance('/api/room/getRoomMsgSys', {
                    t: data.content.content,
                }).then(this._onGlobalBatchMessage);
            }
        }

        if (data.content.typeID == 701) {
            this.emit('receiveres', data.content.content);
            this.emit(
                'receiveres:' + data.content.content.t,
                data.content.content,
            );
        }
    }

    sendMsg(type, data) {
        if (this._authKey || type === 'priv_info') {
            BaseWebSocket.prototype.sendMsg.call(this, type, data);
        } else {
            this._waitQueue.push([type, data]);
        }
    }

    close() {
        this._authKey = '';
        this._waitQueue = [];
        BaseWebSocket.prototype.close.call(this);
    }

    _emitReceiveEvent(data) {
        this.emit('receive:' + data.typeID, data);
    }

    _onGlobalBatchMessage(data) {
        for (var i = 0; i < data.content.length; i++) {
            var item = data.content[i];
            this.debugLog(
                'Batch messages[' +
                    i +
                    '/' +
                    data.content.length +
                    ']:\n' +
                    JSON.stringify(item),
            );
            this._emitReceiveEvent(item);
        }
    }

    _dumpWaitQueue() {
        var item;

        while ((item = this._waitQueue.shift())) {
            let [type, data] = item;

            if (data && typeof data == 'object') {
                data.ak = data.ak || this._authKey;
            }
            this.sendMsg(type, data);
        }
    }
}

export default new RoomWebSocket();
