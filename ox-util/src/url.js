import {merge} from './oop.js';

var rurl = new RegExp(
    [
        // protocal
        /^(https?:)?(?:\/\/)?/,
        // domain or IP
        /((?:[\d\w.-]+\.[a-z]{2,6}|[\d.]+))?/,
        // port
        /(:\d+)?/,
        // pathname
        /([^?#]+)?/,
        // search
        /(\?[^#]*)?/,
        // hash
        /(#.*)?$/
    ]
        .map((i) => i.source)
        .join('')
);

export default {
    rurl: rurl,

    parse(url) {
        var result;

        if (typeof url == 'string') {
            let matchobj = (result = rurl.exec(url.replace(/@/g, '.').trim()));

            if (matchobj) {
                let protocol = matchobj[1] || '';
                let hostname = matchobj[2] || '';
                let port = matchobj[3] ? matchobj[3].slice(1) : '';
                let host = hostname + (port ? ':' + port : '');
                let pathname = matchobj[4] || '';
                let search =
                    !matchobj[5] || matchobj[5] == '?' ? '' : matchobj[5];
                let hash =
                    !matchobj[6] || matchobj[6] == '#' ? '' : matchobj[6];
                let href = url;

                result = {
                    protocol,
                    hostname,
                    port,
                    host,
                    pathname,
                    search,
                    hash,
                    href
                };
            }
        } else if (typeof url == 'object') {
            result = '';

            if (url.protocol) {
                result = url.protocol + '//';
            } else if (url.hostname || url.host) {
                result += '//';
            }
            if (url.hostname) {
                result += url.hostname + (url.port ? ':' + url.port : '');
            } else if (url.host) {
                result += url.host;
            }
            result += url.pathname || '';
            result += url.search || '';
            result += url.hash || '';
        }

        return result;
    },

    make(baseUrl, paramObj) {
        var baseUrlObj = this.parse(baseUrl);
        var baseParamObj = this.param(baseUrlObj.search);
        var paramStr = this.param(merge(baseParamObj, paramObj));

        baseUrlObj.search = paramStr ? '?' + paramStr : '';

        return this.parse(baseUrlObj);
    },

    param(arg) {
        var result;

        if (typeof arg == 'object') {
            let params = [];
            Object.keys(arg).forEach((key) => {
                var value = arg[key];
                if (typeof value !== 'undefined') {
                    if (Array.isArray(value)) {
                        for (let i = 0; i < value.length; i++) {
                            params.push(
                                key + '[]=' + encodeURIComponent(value[i])
                            );
                        }
                    } else {
                        params.push(key + '=' + encodeURIComponent(value));
                    }
                }
            });
            result = params.join('&');
        } else if (typeof arg == 'string') {
            arg =
                arg.indexOf('?') == 0 || arg.indexOf('#') == 0
                    ? arg.slice(1)
                    : arg;
            result = {};

            if (arg) {
                arg.split('&').forEach((item, index) => {
                    var [key, value] = item.split('=');

                    result[key] = this.decode(value);
                });
            }
        }

        return result;
    },

    decode(str) {
        try {
            return decodeURIComponent(str);
        } catch (e) {
            if (e.name == 'URIError') {
                return str;
            } else {
                throw e;
            }
        }
    }
};
