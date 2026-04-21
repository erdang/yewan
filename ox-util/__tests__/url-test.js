import urltool from '../src/url.js';
import {mix} from '../src/oop.js';

describe('urltool', () => {
    it('parse some urls', () => {
        var urlObj;

        urlObj = urltool.parse('http://m.v.6.cn/live/u1?a=1&b=2#overlay');
        expect(urlObj.protocol).toBe('http:');
        expect(urlObj.hostname).toBe('m.v.6.cn');
        expect(urlObj.pathname).toBe('/live/u1');
        expect(urlObj.search).toBe('?a=1&b=2');
        expect(urlObj.hash).toBe('#overlay');

        urlObj = urltool.parse('http://127.0.0.1:12345/live/u1');
        expect(urlObj.host).toBe('127.0.0.1:12345');
        expect(urlObj.hostname).toBe('127.0.0.1');
        expect(urlObj.port).toBe('12345');

        urlObj = urltool.parse('/live/u1');
        expect(urlObj.pathname).toBe('/live/u1');
        expect(urlObj.hostname).toBe('');
        expect(urlObj.protocol).toBe('');

        urlObj = urltool.parse('live/u1');
        expect(urlObj.pathname).toBe('live/u1');

        urlObj = urltool.parse('www.6.cn@baidu.com/');
        expect(urlObj.host).toBe('www.6.cn.baidu.com');
        expect(urlObj.pathname).toBe('/');

        urlObj = urltool.parse('www.6.cn@baidu.com@yy.com');
        expect(urlObj.hostname).toBe('www.6.cn.baidu.com.yy.com');
        expect(urlObj.pathname).toBe('');
        expect(urlObj.protocol).toBe('');

        urlObj = urltool.parse(
            ' http://m.v.6.cn/9995555' +
                '?src=ummeda30017&cooper=cmshow&endpoint=true&coop=baold'
        );
        expect(urlObj.pathname).toBe('/9995555');
        expect(urlObj.host).toBe('m.v.6.cn');
        expect(urlObj.protocol).toBe('http:');
        expect(urlObj.search).toBe(
            '?src=ummeda30017&cooper=cmshow&endpoint=true&coop=baold'
        );
    });

    it('make url string from some object', () => {
        var urlObj = {
            protocol: 'https:',
            hostname: 'm.v.6.cn',
            pathname: '/live/u1',
            search: '?x=1'
        };
        expect(urltool.parse(urlObj)).toBe('https://m.v.6.cn/live/u1?x=1');

        urlObj = {
            hostname: 'm.v.6.cn',
            pathname: '/live/'
        };
        expect(urltool.parse(urlObj)).toBe('//m.v.6.cn/live/');

        urlObj = {
            pathname: '/live/u0',
            search: '?y=2',
            hash: '#a'
        };
        expect(urltool.parse(urlObj)).toBe('/live/u0?y=2#a');

        urlObj = {
            protocol: 'https:',
            host: 'v.6.cn',
            pathname: '/'
        };
        expect(urltool.parse(urlObj)).toBe('https://v.6.cn/');

        urlObj = {
            host: 'v.6.cn:8080'
        };
        expect(urltool.parse(urlObj)).toBe('//v.6.cn:8080');

        urlObj = {
            hostname: '996.icu'
        };
        expect(urltool.parse(urlObj)).toBe('//996.icu');

        urlObj = {
            hostname: 'www.youtube.com',
            port: '8080'
        };
        expect(urltool.parse(urlObj)).toBe('//www.youtube.com:8080');

        urlObj = {
            protocol: 'https:',
            hostname: 'v.6.cn',
            port: ''
        };
        expect(urltool.parse(urlObj)).toBe('https://v.6.cn');
    });

    it('parse url to object, then parse object to url', () => {
        var url;

        url = 'https://v.6.cn/video.php?a=1&b=2';
        expect(urltool.parse(urltool.parse(url))).toBe(url);

        url = '/1234?src=ummeda5002';
        expect(urltool.parse(urltool.parse(url))).toBe(url);

        url = 'm.v.6.cn/100#100';
        expect(urltool.parse(urltool.parse(url))).toBe('//' + url);

        url = '/aya-start/synopsis';
        expect(urltool.parse(urltool.parse(url))).toBe(url);

        url = 'http://www.6.cn';
        expect(urltool.parse(urltool.parse(url))).toBe(url);

        url = '//vr0.6rooms.com/v2/3j24herj03.png';
        expect(urltool.parse(urltool.parse(url))).toBe(url);
    });

    it('should join url and query parameters correctly', () => {
        var baseUrl;
        var parameters;

        baseUrl = '/live/u1';
        parameters = {
            a: 1,
            b: null
        };
        expect(urltool.make(baseUrl, parameters)).toBe('/live/u1?a=1&b=null');

        baseUrl = 'http://m.v.6.cn/?a=1';
        parameters = {
            b: 2
        };
        expect(urltool.make(baseUrl, parameters)).toBe(
            'http://m.v.6.cn/?a=1&b=2'
        );

        baseUrl = '/live/u1';
        parameters = {};
        expect(urltool.make(baseUrl, parameters)).toBe('/live/u1');
    });

    it('make query string from object', () => {
        var param;

        param = {
            a: 0,
            b: 'http://m.v.6.cn/'
        };
        expect(urltool.param(param)).toBe(
            'a=0&b=' + encodeURIComponent('http://m.v.6.cn/')
        );

        param = {
            a: undefined
        };
        expect(urltool.param(param)).toBe('');

        param = {
            a: 1,
            b: undefined,
            c: [1, 3, 'EVA'],
            d: 'a=b'
        };
        expect(urltool.param(param)).toBe('a=1&c[]=1&c[]=3&c[]=EVA&d=a%3Db');
    });

    it('parse query string', () => {
        var query;

        query = 'a=0&b=http://m.v.6.cn';
        expect(urltool.param(query).a).toBe('0');
        expect(urltool.param(query).b).toBe('http://m.v.6.cn');

        query = '';
        expect(urltool.param(query)).toEqual({});

        query = '?';
        expect(urltool.param(query)).toEqual({});
    });

    it('parse a malformed query string', () => {
        var query = '?a=%2';

        expect(urltool.param(query).a).toBe('%2');
    });

    it('merge two urlObj', () => {
        var href = 'https://m.6.cn/100/synopsis?a=1';
        var path = '/pay/callback?b=1';
        var hrefObj = urltool.parse(href);
        var pathObj = urltool.parse(path);

        mix(hrefObj, pathObj, true, ['pathname', 'search']);

        expect(urltool.parse(hrefObj)).toBe('https://m.6.cn/pay/callback?b=1');
    });
});
