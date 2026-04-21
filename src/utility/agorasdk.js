import loadScript from 'ox-util/src/loadscript.js';

const JS_SDK = '//download.agora.io/sdk/release/AgoraRTC_N-4.11.1.js';

class AgoraSdk {
    constructor() {
        this.AgoraRTC = '';
        this.client = null;
        this.localAudioTrack = null;
        [
            'init',
            'startBasic',
            'joinFn',
            'leaveFn',
            'subscribeFn',
            'unpublished',
        ].forEach((i) => {
            this[i] = this[i].bind(this);
        });
    }
    init() {
        if (!this.AgoraRTC || !window.AgoraRTC) {
            return loadScript(JS_SDK).then(this.startBasic);
        }
        // return this.startBasic();
    }
    startBasic() {
        return new Promise((resolve, reject) => {
            this.AgoraRTC = window.AgoraRTC;
            this.client = this.AgoraRTC.createClient({
                mode: 'live',
                codec: 'vp8',
            });
            resolve('加载成功');
        });
    }
    joinFn({ appId, channel, token, uid }) {
        this.client && this.client.setClientRole('audience');
        return this.client.join(appId, channel, token, uid).then(() => {
            this.subscribeFn();
        });
    }
    leaveFn() {
        this.localAudioTrack && this.localAudioTrack.close();
        this.localAudioTrack = null;
        this.client && this.client.leave();
        this.client && this.unpublished();
        // this.client = null;
    }
    subscribeFn() {
        return this.client.on('user-published', async (user, mediaType) => {
            await this.client.subscribe(user, mediaType);
            if (mediaType === 'audio') {
                this.localAudioTrack = user.audioTrack;
                this.localAudioTrack && this.localAudioTrack.play();
            }
        });
    }
    unpublished() {
        this.client.on('user-unpublished', (user) => {
            this.client.unsubscribe(user);
        });
    }
}
export default new AgoraSdk();
