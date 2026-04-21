'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
exports['default'] = exports.Browser = void 0;

var _oop = require('./oop.js');

var Browser = function Browser() {
    this._detect();
};

exports.Browser = Browser;
(0, _oop.mix)(Browser.prototype, {
    isdesktop: function isdesktop() {
        // 忽略 Linux 桌面
        return (
            !/Android|webOS|iPhone|iPad|iPod|BB10|IEMobile/i.test(this._ua()) &&
            /Windows|Macintosh/i.test(this._ua())
        );
    },
    isiOS: function isiOS() {
        var _this = this;

        var ios = ['iPhone', 'iPad', 'iPod'];
        return ios.some(function (item) {
            return _this._ua().indexOf(item) > -1;
        });
    },
    // small screen iOS drives , iPhone and iPod.
    issiOS: function issiOS() {
        return this.isiOS() && this._ua().indexOf('iPad') < 0;
    },
    getiOSVersion: function getiOSVersion() {
        var match = this.isiOS() && this._ua().match(/OS\s+([\d_]+)/);

        return (match && parseFloat(match[1].replace('_', '.'))) || 0;
    },
    isandroid: function isandroid() {
        return /android/i.test(this._ua());
    },
    isnexus: function isnexus() {
        return this._ua().toLowerCase().indexOf('nexus') > -1;
    },
    ispixel: function ispixel() {
        return this._ua().indexOf('Pixel Build') > -1;
    },
    getandroidVersion: function getandroidVersion() {
        var version = parseFloat(
            this._ua().slice(this._ua().indexOf('Android') + 8),
        );
        return this.isandroid() ? (isNaN(version) ? 5 : version) : 0;
    },
    iswindows: function iswindows() {
        return /windows phone/i.test(this._ua());
    },
    isuc: function isuc() {
        return this._ua().indexOf('UCBrowser') > -1;
    },
    isqq: function isqq() {
        return (
            this._ua().indexOf('MQQBrowser') > -1 &&
            !this.iswechat() &&
            !this.isqqApp()
        );
    },
    isqqApp: function isqqApp() {
        return /qq\/\d+/i.test(this._ua());
    },
    iswechat: function iswechat() {
        return /micromessenger/i.test(this._ua());
    },
    isbaidu: function isbaidu() {
        return /baidubrowser/i.test(this._ua());
    },
    isbaiduApp: function isbaiduApp() {
        return /baiduboxapp/i.test(this._ua());
    },
    isweibo: function isweibo() {
        return /weibo/i.test(this._ua());
    },
    getweiboVersion: function getweiboVersion() {
        var ua = this._ua();

        var pattern = /__weibo__([\d.]+)/i;
        var matchObj = pattern.exec(ua);
        var version = 0;

        if (matchObj) {
            version = parseFloat(matchObj[1]);
        }

        return version;
    },
    isxiaomi: function isxiaomi() {
        return /miuibrowser/i.test(this._ua());
    },
    isoppo: function isoppo() {
        return /oppobrowser/i.test(this._ua());
    },
    isvivo: function isvivo() {
        return /vivobrowser/i.test(this._ua());
    },
    ishuawei: function ishuawei() {
        return /huaweibrowser/i.test(this._ua());
    },
    isquickapp: function isquickapp() {
        return /\s+hap\//i.test(this._ua());
    },
    ischrome: function ischrome() {
        return /chrome|chromium/i.test(this._ua());
    },
    getchromeVersion: function getchromeVersion() {
        var ua = this._ua();

        var matchObj = ua.match(/Chrom(e|ium)\/([0-9]+)\./);
        return matchObj ? parseInt(matchObj[2], 10) : 0;
    },
    // iOS(version >= 5) and chrome(suggest great than 32) would prevent
    // click event in
    // touchend event handler by preventDefault() without preventing
    // scroll.
    // Other browsers in Android we need use ClickBuster to prevent
    // click event after touchend event already performed.
    preventDefaultInTouchendCanScroll:
        function preventDefaultInTouchendCanScroll() {
            var rchrome = /chrome\/(\d+)/i;
            var result = rchrome.exec(this._ua());
            return this.isiOS() || (result && result[1] > 32);
        },
    getQuickAppInfo: function getQuickAppInfo() {
        var ua = this._ua();

        var pattern = new RegExp(
            [
                /\s+hap\//,
                /([^/]+?)\//,
                /([^/]+?)\s+([^/]+?)\//,
                /([^/]+?)\s+([^/]+?)\//,
                /([\d.]+)\s+\((.*)\)$/,
            ]
                .map(function (i) {
                    return i.source;
                })
                .join(''),
        );
        var matchObj = pattern.exec(ua);
        var result = null;

        if (matchObj) {
            result = {
                platformVersion: matchObj[1],
                brand: matchObj[2],
                platformAppName: matchObj[3],
                platformAppVersion: matchObj[4],
                appName: matchObj[5],
                appVersion: matchObj[6],
            };

            try {
                result.origin = JSON.parse(matchObj[7]);
            } catch (e) {
                result.origin = null;
            }
        }

        return result;
    },
    isspider: function isspider() {
        return new RegExp(
            'Baiduspider|Googlebot|\\sSlurp|iaskspider|' +
                'YodaoBot|msnbot|\\sspider',
            'i',
        ).test(this._ua());
    },
    _ua: function _ua() {
        return window.navigator.userAgent;
    },
    _detect: function _detect() {
        for (var p in this) {
            if (p.indexOf('is') == 0 && typeof this[p] == 'function') {
                this[p.slice(2)] = this[p]();
            } else if (p.indexOf('get') == 0 && typeof this[p] == 'function') {
                this[p.slice(3)] = this[p]();
            }
        }
    },
});

var _default = new Browser();

exports['default'] = _default;
