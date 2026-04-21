/* global wx */
import browser from 'ox-util/src/browser';
import { Timer } from 'ox-util/src/timer.js';
import loadScript from 'ox-util/src/loadscript.js';
import instance from '@/request';

// https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html

const JS_SDK = '//res.wx.qq.com/open/js/jweixin-1.6.0.js';
const DEFAULT_THUMB =
    location.protocol +
    '//vr1.6rooms.com/v/' +
    'g3/cb3f21afd93fb71cc4368efd4e1d4bdc.png';

var WechatSdk = function () {
    this.isReady = false;
    this.autoPlayCount = 0;
    this.timer = new Timer();

    ['getConfig', 'getConfigBack', 'config'].forEach((i) => {
        this[i] = this[i].bind(this);
    });

    if (browser.wechat) {
        loadScript(JS_SDK);
    }
};

WechatSdk.prototype = {
    ready() {
        if (!browser.wechat) {
            return Promise.reject('Not in wechat');
        }
        if (!('wx' in self)) {
            return loadScript(JS_SDK).then(this.getConfig).then(this.config);
        }
        if (!this.isReady) {
            return this.getConfig().then(this.config);
        }
        return Promise.resolve(self.wx);
    },

    isAvailable() {
        return browser.wechat && 'wx' in window;
    },

    shareConfig({
        title = document.title,
        desc = '六间房是真人互动视频直播社区。',
        link = location.href,
        imgUrl = DEFAULT_THUMB,
        success,
    } = {}) {
        var param = { title, desc, link, imgUrl, success };
        if (this.isAvailable()) {
            wx.onMenuShareTimeline(param);
            wx.onMenuShareAppMessage(param);
            wx.onMenuShareQQ(param);
            wx.onMenuShareQZone(param);
        }
    },

    resetShareConfig() {
        this.shareConfig();
    },

    getConfig() {
        return instance.get('/wechat/jsSdk').then(this.getConfigBack);
    },

    getConfigBack(data) {
        if (data.code == '001') {
            return {
                appId: String(data.content.appId),
                timestamp: String(data.content.timestamp),
                nonceStr: String(data.content.nonceStr),
                signature: String(data.content.signature),
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                ],
                openTagList: ['wx-open-launch-app'],
                debug: false,
            };
        }
        return Promise.reject(data.content);
    },

    config(configParam) {
        console.log(configParam);
        return new Promise((resolve, reject) => {
            wx.config(configParam);
            wx.ready(() => {
                this.isReady = true;
                this.autoPlay();
                resolve({ wx, configParam });
            });
            wx.error((res) => {
                reject(res);
            });
        });
    },

    autoPlay() {
        var videos = document.querySelectorAll('.wechat-autoplay');

        try {
            for (var i = 0; i < videos.length; i++) {
                if (videos[i].src) {
                    videos[i].play();
                }
            }
        } catch (e) {
            // pass
        }

        if (this.autoPlayCount < 3) {
            this.timer.set(this._autoPlay, 1000);
            this.autoPlayCount++;
        } else {
            this.autoPlayCount = 0;
        }
    },
};

export default new WechatSdk();
