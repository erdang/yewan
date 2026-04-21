import {mix} from './oop.js';

var Browser = function () {
    this._detect();
};

mix(Browser.prototype, {
    isdesktop() {
        // 忽略 Linux 桌面
        return (
            !/Android|webOS|iPhone|iPad|iPod|BB10|IEMobile/i.test(this._ua()) &&
            /Windows|Macintosh/i.test(this._ua())
        );
    },

    isiOS() {
        var ios = ['iPhone', 'iPad', 'iPod'];

        return ios.some((item) => this._ua().indexOf(item) > -1);
    },

    // small screen iOS drives , iPhone and iPod.
    issiOS() {
        return this.isiOS() && this._ua().indexOf('iPad') < 0;
    },

    getiOSVersion() {
        var match = this.isiOS() && this._ua().match(/OS\s+([\d_]+)/);

        return (match && parseFloat(match[1].replace('_', '.'))) || 0;
    },

    isandroid() {
        return /android/i.test(this._ua());
    },

    isnexus() {
        return this._ua().toLowerCase().indexOf('nexus') > -1;
    },

    ispixel() {
        return this._ua().indexOf('Pixel Build') > -1;
    },

    getandroidVersion() {
        var version = parseFloat(
            this._ua().slice(this._ua().indexOf('Android') + 8)
        );
        return this.isandroid() ? (isNaN(version) ? 5 : version) : 0;
    },

    iswindows() {
        return /windows phone/i.test(this._ua());
    },

    isuc() {
        return this._ua().indexOf('UCBrowser') > -1;
    },

    isqq() {
        return (
            this._ua().indexOf('MQQBrowser') > -1 &&
            !this.iswechat() &&
            !this.isqqApp()
        );
    },

    isqqApp() {
        return /qq\/\d+/i.test(this._ua());
    },

    iswechat() {
        return /micromessenger/i.test(this._ua());
    },

    isbaidu() {
        return /baidubrowser/i.test(this._ua());
    },

    isbaiduApp() {
        return /baiduboxapp/i.test(this._ua());
    },

    isweibo() {
        return /weibo/i.test(this._ua());
    },

    getweiboVersion() {
        var ua = this._ua();
        var pattern = /__weibo__([\d.]+)/i;
        var matchObj = pattern.exec(ua);
        var version = 0;

        if (matchObj) {
            version = parseFloat(matchObj[1]);
        }

        return version;
    },

    isxiaomi() {
        return /miuibrowser/i.test(this._ua());
    },

    isoppo() {
        return /oppobrowser/i.test(this._ua());
    },

    isvivo() {
        return /vivobrowser/i.test(this._ua());
    },

    ishuawei() {
        return /huaweibrowser/i.test(this._ua());
    },

    isquickapp() {
        return /\s+hap\//i.test(this._ua());
    },

    ischrome() {
        return /chrome|chromium/i.test(this._ua());
    },

    getchromeVersion() {
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
    preventDefaultInTouchendCanScroll() {
        var rchrome = /chrome\/(\d+)/i;
        var result = rchrome.exec(this._ua());

        return this.isiOS() || (result && result[1] > 32);
    },

    getQuickAppInfo() {
        var ua = this._ua();
        var pattern = new RegExp(
            [
                /\s+hap\//,
                /([^/]+?)\//,
                /([^/]+?)\s+([^/]+?)\//,
                /([^/]+?)\s+([^/]+?)\//,
                /([\d.]+)\s+\((.*)\)$/
            ]
                .map((i) => i.source)
                .join('')
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
                appVersion: matchObj[6]
            };
            try {
                result.origin = JSON.parse(matchObj[7]);
            } catch (e) {
                result.origin = null;
            }
        }
        return result;
    },

    isspider() {
        return new RegExp(
            'Baiduspider|Googlebot|\\sSlurp|iaskspider|' +
                'YodaoBot|msnbot|\\sspider',
            'i'
        ).test(this._ua());
    },

    _ua() {
        return window.navigator.userAgent;
    },

    _detect() {
        for (var p in this) {
            if (p.indexOf('is') == 0 && typeof this[p] == 'function') {
                this[p.slice(2)] = this[p]();
            } else if (p.indexOf('get') == 0 && typeof this[p] == 'function') {
                this[p.slice(3)] = this[p]();
            }
        }
    }
});

export {Browser};
export default new Browser();
