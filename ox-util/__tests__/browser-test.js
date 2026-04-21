import {Browser} from '../src/browser.js';

const CHROME_PIXEL = `
    Mozilla/5.0 (Linux; Android 7.1.2; Pixel Build/NJH47B)
    AppleWebKit/537.36 (KHTML, like Gecko)
    Chrome/60.0.3112.33 Mobile Safari/537.36`;

const SAFARI_IOS_8_IPHONE = `
    Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_1 like Mac OS X)
    AppleWebKit/600.1.4 (KHTML, like Gecko)
    Version/8.0 Mobile/12A402 Safari/600.1.4`;

const SAFARI_IOS_9_IPHONE = `
    Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_2 like Mac OS X)
    AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0
    Mobile/13A452 Safari/601.1`;

const SAFARI_IOS_10_IPHONE = `
    Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X)
    AppleWebKit/602.1.50 (KHTML, like Gecko)
    Version/10.0 Mobile/14A403 Safari/602.1`;

const SAFARI_IOS_10_IPAD = `
    Mozilla/5.0 (iPad; CPU OS 10_0_2 like Mac OS X)
    AppleWebKit/602.1.50 (KHTML, like Gecko)
    Version/10.0 Mobile/14A456 Safari/602.1`;

const QQ_BROWSER_ANDROID = `
    Mozilla/5.0 (Linux; U; Android 4.4.4; zh-cn; M032 Build/IML74K)
    AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/4.1
    Mobile Safari/533.1`;

const QQ_BROWSER_IOS = `
    Mozilla/5.0 (iPhone 6; CPU iPhone OS 10_0_1 like Mac OS X)
    AppleWebKit/602.1.50 (KHTML, like Gecko) Version/6.0
    MQQBrowser/6.9.1 Mobile/14A403 Safari/8536.25 MttCustomUA/2`;

const QQ_APP_ANDROID = `
    Mozilla/5.0 (Linux; Android 7.1.1; vivo X9 Build/NMF26F; wv)
    AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0
    Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043313 Safari/537.36
    V1_AND_SQ_7.5.0_794_YYB_D QQ/7.5.0.3430 NetType/WIFI WebP/0.3.0 Pixel/1080`;

const QQ_APP_IOS = `Mozilla/5.0 (iPhone; CPU iPhone OS 12_5_1 like Mac OS X)
    AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16H22 QQ/8.5.5.648
    V1_IPH_SQ_8.5.5_1_APP_A Pixel/750 SimpleUISwitch/0 QQTheme/1000
    Core/WKWebView Device/Apple(iPhone 6) NetType/WIFI QBWebViewType/1
    WKType/1`;

const WECHAT_ANDROID = `
    Mozilla/5.0 (Linux; U; Android 5.0.2; zh-cn; NX511J Build/LRX22G)
    AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0
    MQQBrowser/8.8 TBS/88888888 Mobile Safari/533.1
    MicroMessenger/6.3.8.56_re6b2553.680 NetType/ctlte Language/zh_CN`;

const WECHAT_ANDROID_NEXUS = `
    Mozilla/5.0 (Linux; Android 7.0; Nexus 6 Build/NBD90Z; wv)
    AppleWebKit/537.36 (KHTML, like Gecko)
    Version/4.0 Chrome/54.0.2840.68 Mobile Safari/537.36
    MicroMessenger/6.3.23.840 NetType/WIFI Language/en`;

const WECHAT_IOS_IPHONE = `
    Mozilla/5.0 (iPhone; CPU iPhone OS 10_1 like Mac OS X)
    AppleWebKit/602.2.14 (KHTML, like Gecko) Mobile/14B72
    MicroMessenger/6.3.28 NetType/WIFI Language/en`;

const UC_ANDROID = `
    Mozilla/5.0 (Linux; U; Android 5.0.1; zh-CN; M040 Build/LRX22C)
    AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/40.0.2214.89
    UCBrowser/11.1.5.871 Mobile Safari/537.36`;

const UC_IOS = `
    Mozilla/5.0 (iPhone; CPU iPhone OS 10_1 like Mac OS X; zh-CN)
    AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/14B72
    UCBrowser/11.2.0.863 Mobile AliApp(TUnionSDK/0.1.6)`;

const BAIDU_ANDROID = `
    Mozilla/5.0 (Linux; Android 5.0.1; M040 Build/LRX22C)
    AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0
    Chrome/35.0.1916.138 Mobile Safari/537.36 T7/7.5 baidubrowser/7.6.12.0
    (Baidu; P1 5.0.1)`;

const BAIDU_IOS = `
    Mozilla/5.0 (iPhone; CPU iPhone OS 10_1 like Mac OS X)
    AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10. Mobile/14B72
    Safari/600.1.4 baidubrowser/4.3.1.18 (Baidu; P2 10.1)`;

const BAIDU_APP_ANDROID = `
    Mozilla/5.0 (Linux; Android 6.0.1; vivo X9 Build/MMB29M)
    AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0
    Chrome/35.0.1916.138 Mobile Safari/537.36 T7/7.4 baiduboxapp/8.1
    (Baidu; P1 6.0.1)`;

const SOGOU_ANDROID = `
    Mozilla/5.0 (Linux; Android 5.0.1; M040; Build/LRX22C; wv)
    AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0
    Chrome/46.0.2490.92 SDK/1.1.3.423 Mobile Safari/537.36
    SogouMSE,SogouMobileBrows`;

const SOGOU_IOS = `
    Mozilla/5.0 (iPhone; CPU iPhone OS 10_1 like Mac OS X)
    AppleWebKit/602.2.14 (KHTML, like Gecko) Mobile/14B72
    SogouMobileBrowser/5.2.2`;

const WEIBO_IOS = `
    Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X)
    AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 Weibo
    (iPhone7,2__weibo__7.1.0__iphone__os10.2.1`;

const WEIBO_ANDROID = `
    Mozilla/5.0 (Linux; Android 6.0.1; vivo X9 Build/MMB29M; wv)
    AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0
    Chrome/51.0.2704.81 Mobile Safari/537.36 Weibo
    (vivo-vivo X9__weibo__7.3.0__android__android6.0.1)`;

const OPPO_BROWSER_ANDROID = `
    Mozilla/5.0 (Linux; U; Android 4.3; zh-cn; X9077 Build/JLS36C)
    AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0
    Chrome/53.0.2785.134 Mobile Safari/534.30 OppoBrowser/4.5.2`;

const VIVO_BROWSER = `
    Mozilla/5.0 (Linux; Android 7.1.2; vivo X9 Build/N2G47H; wv)
    AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile
    Safari/537.36 VivoBrowser/8.9.14.0
`;

const HUAWEI_BROWSER = `
    Mozilla/5.0 (Linux; Android 10; ELE-AL00; HMSCore 5.1.1.300;
    GMSCore 20.15.16) AppleWebKit/537.36 (KHTML, like Gecko)
    Chrome/83.0.4103.106 HuaweiBrowser/11.0.6.301 Mobile Safari/537.36
`;

const QUICK_APP_VIVO = `
    Mozilla/5.0 (Linux; Android 7.1.2; vivo X9 Build/N2G47H; wv)
    AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0
    Chrome/69.0.3497.100 Mobile Safari/537.36
    hap/1.2/vivo com.vivo.hybrid/1.2.0.1-RC-50 cn.6.meizu/5.0.3
    ({"packageName":"com.bbk.launcher2","type":"shortcut",
    "extra":{"original":{"packageName":"com.vivo.hybrid","type":"unknown",
    "extra":{"version":"1.2.0.1-RC-50"}},"scene":"dialog","version":"3.5"}})
`;

const QUICK_APP_HUAWEI = `
    Mozilla/5.0 (Linux; Android 7.0; DUK-AL20 Build/HUAWEIDUK-AL20; wv)
    AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0
    Chrome/59.0.3071.125 Mobile Safari/537.36
    hap/1.2/huawei org.hapjs.mockup/1.2.0.0 cn.6.meizu/5.0.3
    ({"packageName":"org.hapjs.mockup","type":"other","extra":{}})
`;

const BAIDU_SPIDER = `
    Mozilla/5.0
    (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)`;

const GOOGLE_SPIDER = `
    Googlebot/2.1 (+http://www.googlebot.com/bot.html)
`;

const YAHOO_SPIDER = `
    Mozilla/5.0 (compatible;
    Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp”)
`;

const SINA_SPIDER = `
    iaskspider/2.0(+http://iask.com/help/help_index.html”)
`;

const SOGOU_SPIDER = `
    Sogou web spider/3.0(+http://www.sogou.com/docs/help/webmasters.htm#07″)
`;

const YOUDAO_SPIDER = `
    Mozilla/5.0
    (compatible; YodaoBot/1.0; http://www.yodao.com/help/webmaster/spider/)
`;

const MACOS_SAFARI = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6)
    AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Safari/605.1.15`;

const MACOS_CHROM = `Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0)
    AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36`;

const WINDOWS_EDGE = `Mozilla/5.0 (Windows NT 10.0; Win64; x64)
    AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141
    Safari/537.36 Edg/87.0.664.75`;

const WINDOWS_IE = `Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0;
    .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729;
    .NET CLR 3.5.30729; rv:11.0) like Gecko`;

var getBrowserInstance = function (ua) {
    var browser = new Browser();

    browser._ua = jest.fn().mockReturnValue(ua.replace(/\n/g, '').trim());
    browser._detect();
    return browser;
};

describe('safari iOS 10 iPhone', () => {
    var browser = getBrowserInstance(SAFARI_IOS_10_IPHONE);

    it('is ios', () => {
        expect(browser.iOS).toBe(true);
    });

    it('ios version is 10', () => {
        expect(browser.iOSVersion).toBe(10.1);
    });

    it('it not iPad', () => {
        expect(browser.siOS).toBe(true);
    });
});

describe('safari iOS 9 iPhone', () => {
    var browser = getBrowserInstance(SAFARI_IOS_9_IPHONE);

    it('is ios', () => {
        expect(browser.iOS).toBe(true);
    });

    it('ios version is 9', () => {
        expect(browser.iOSVersion).toBe(9);
    });
});

describe('safari iOS 8 iPhone', () => {
    var browser = getBrowserInstance(SAFARI_IOS_8_IPHONE);

    it('is ios', () => {
        expect(browser.iOS).toBe(true);
    });

    it('ios version is 8', () => {
        expect(browser.iOSVersion).toBe(8);
    });
});

describe('safari iOS 10 iPad', () => {
    var browser = getBrowserInstance(SAFARI_IOS_10_IPAD);

    it('not iPhone or iPod', () => {
        expect(browser.siOS).toBe(false);
    });
});

describe('qq browser on Android', () => {
    var browser = getBrowserInstance(QQ_BROWSER_ANDROID);

    it('is android', () => {
        expect(browser.android).toBe(true);
        expect(browser.androidVersion).toBe(4.4);
    });

    it('not ios', () => {
        expect(browser.iOS).toBe(false);
    });

    it('is qq browser', () => {
        expect(browser.qq).toBe(true);
    });

    it('is not wechat', () => {
        expect(browser.wechat).toBe(false);
    });
});

describe('qq browser on iOS', () => {
    var browser = getBrowserInstance(QQ_BROWSER_IOS);

    it('is iOS', () => {
        expect(browser.iOS).toBe(true);
    });

    it('is qq browser', () => {
        expect(browser.qq).toBe(true);
    });
});

describe('qq app', () => {
    it('is qq app', () => {
        expect(getBrowserInstance(QQ_APP_IOS).qqApp).toBe(true);
        expect(getBrowserInstance(QQ_APP_ANDROID).qqApp).toBe(true);
    });
    it('is qq browser but not qq app', () => {
        expect(getBrowserInstance(QQ_BROWSER_IOS).qq).toBe(true);
        expect(getBrowserInstance(QQ_BROWSER_IOS).qqApp).toBe(false);
        expect(getBrowserInstance(QQ_BROWSER_ANDROID).qq).toBe(true);
        expect(getBrowserInstance(QQ_BROWSER_ANDROID).qqApp).toBe(false);
    });
});

describe('wechat on Android', () => {
    var browser = getBrowserInstance(WECHAT_ANDROID);

    it('is wechat', () => {
        expect(browser.wechat).toBe(true);
    });

    it('is not qq browser', () => {
        expect(browser.qq).toBe(false);
    });
});

describe('wechat on Android Nexus', () => {
    var browser = getBrowserInstance(WECHAT_ANDROID_NEXUS);

    it('is wechat', () => {
        expect(browser.wechat).toBe(true);
    });

    it('is Nexus', () => {
        expect(browser.nexus).toBe(true);
    });
});

describe('weibo App on iOS', () => {
    var browser = getBrowserInstance(WEIBO_IOS);

    it('is weibo', () => {
        expect(browser.weibo).toBe(true);
    });

    it('is iOS', () => {
        expect(browser.iOS).toBe(true);
    });

    it('is not Android', () => {
        expect(browser.android).toBe(false);
    });

    it('version of weibo is', () => {
        expect(browser.weiboVersion).toBe(7.1);
    });
});

describe('weibo App on Android', () => {
    var browser = getBrowserInstance(WEIBO_ANDROID);

    it('is weibo', () => {
        expect(browser.weibo).toBe(true);
    });

    it('is Android', () => {
        expect(browser.android).toBe(true);
    });

    it('version of weibo is', () => {
        expect(browser.weiboVersion).toBe(7.3);
    });
});

describe('wechat on iOS', () => {
    var browser = getBrowserInstance(WECHAT_IOS_IPHONE);

    it('is wechat', () => {
        expect(browser.wechat).toBe(true);
    });

    it('is iOS', () => {
        expect(browser.iOS).toBe(true);
    });

    it('is not Android', () => {
        expect(browser.android).toBe(false);
    });
});

describe('browsers that use nonstandard player', () => {
    it('is uc and is nonstandard', () => {
        var browser = getBrowserInstance(UC_ANDROID);

        expect(browser.android).toBe(true);
        expect(browser.uc).toBe(true);

        browser = getBrowserInstance(UC_IOS);

        expect(browser.iOS).toBe(true);
        expect(browser.uc).toBe(true);
    });

    it('is baidu browser and is nonstandard', () => {
        var browser = getBrowserInstance(BAIDU_ANDROID);

        expect(browser.android).toBe(true);
        expect(browser.baidu).toBe(true);

        browser = getBrowserInstance(BAIDU_IOS);

        expect(browser.iOS).toBe(true);
        expect(browser.baidu).toBe(true);
    });

    it('is baidu app and is nonstandard', () => {
        var browser = getBrowserInstance(BAIDU_APP_ANDROID);

        expect(browser.android).toBe(true);
        expect(browser.baiduApp).toBe(true);
    });
});

describe('check pixel phone', () => {
    var pixelBrowser = getBrowserInstance(CHROME_PIXEL);
    var qqAppBrowser = getBrowserInstance(QQ_APP_ANDROID);

    it('is google pixel phone', () => {
        expect(pixelBrowser.pixel).toBe(true);
    });

    it('is not pixel phone', () => {
        expect(qqAppBrowser.pixel).toBe(false);
    });
});

describe('oppo browser', () => {
    var browser = getBrowserInstance(OPPO_BROWSER_ANDROID);

    it('is oppo browser', () => {
        expect(browser.oppo).toBe(true);
    });
});

describe('vivo browser', () => {
    it('is vivo browser', () => {
        expect(getBrowserInstance(VIVO_BROWSER).vivo).toBe(true);
    });
    it('is not vivo browser', () => {
        expect(getBrowserInstance(QUICK_APP_VIVO).vivo).toBe(false);
    });
});

describe('huawei browser', () => {
    it('is huawei browser', () => {
        var browser = getBrowserInstance(HUAWEI_BROWSER);

        expect(browser.huawei).toBe(true);
    });

    it('is not not huawei browser', () => {
        var browser = getBrowserInstance(QUICK_APP_HUAWEI);

        expect(browser.huawei).toBe(false);
    });
});

describe('get version of chrome', () => {
    it('get chrome version of sogou browser', () => {
        var browser = getBrowserInstance(SOGOU_ANDROID);

        expect(browser.chromeVersion).toBe(46);
    });

    it('get chrome version of iOS safari', () => {
        var browser = getBrowserInstance(SAFARI_IOS_10_IPHONE);

        expect(browser.chromeVersion).toBe(0);
    });
});

describe('get quick app info', () => {
    it('quickapp on vivo', () => {
        var browser = getBrowserInstance(QUICK_APP_VIVO);
        var quickAppInfo = browser.getQuickAppInfo();

        expect(quickAppInfo.brand).toBe('vivo');
    });

    it('quickapp on huawei', () => {
        var browser = getBrowserInstance(QUICK_APP_HUAWEI);
        var quickAppInfo = browser.getQuickAppInfo();

        expect(quickAppInfo.brand).toBe('huawei');
    });

    it('not quickapp', () => {
        var browser = getBrowserInstance(SOGOU_IOS);
        expect(browser.quickapp).toBe(false);
    });

    it('is quickapp', () => {
        var browser = getBrowserInstance(QUICK_APP_HUAWEI);
        expect(browser.quickapp).toBe(true);
    });
});

describe('desktop browser', () => {
    it('not desktop', () => {
        var browser = getBrowserInstance('Xc0xDoMwDAXQG6Fv7CR2tqpzpd4AJYAp@');

        expect(browser.desktop).toBe(false);

        browser = getBrowserInstance(QUICK_APP_HUAWEI);
        expect(browser.desktop).toBe(false);
    });
    it('is desktop', () => {
        expect(getBrowserInstance(WINDOWS_EDGE).desktop).toBe(true);
        expect(getBrowserInstance(MACOS_SAFARI).desktop).toBe(true);
        expect(getBrowserInstance(MACOS_CHROM).desktop).toBe(true);
        expect(getBrowserInstance(WINDOWS_IE).desktop).toBe(true);
    });
});

describe('search spider', () => {
    it('spiders', () => {
        expect(getBrowserInstance(BAIDU_SPIDER).spider).toBe(true);
        expect(getBrowserInstance(GOOGLE_SPIDER).spider).toBe(true);
        expect(getBrowserInstance(SOGOU_SPIDER).spider).toBe(true);
        expect(getBrowserInstance(YAHOO_SPIDER).spider).toBe(true);
        expect(getBrowserInstance(YOUDAO_SPIDER).spider).toBe(true);
        expect(getBrowserInstance(SINA_SPIDER).spider).toBe(true);
        expect(getBrowserInstance(BAIDU_ANDROID).spider).toBe(false);
        expect(getBrowserInstance(SOGOU_IOS).spider).toBe(false);
        expect(getBrowserInstance(CHROME_PIXEL).spider).toBe(false);
        expect(getBrowserInstance(BAIDU_APP_ANDROID).spider).toBe(false);
    });
});
