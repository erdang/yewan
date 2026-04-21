const buildURL = function (url, params) {
    if (!params) {
        return url;
    }

    // params序列化过程略
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + params.join('&');

    return url;
};
const buildURLNO = function (url, params) {
    if (!params) {
        return url;
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + params.join('&');

    return url;
};

export { buildURL, buildURLNO };
