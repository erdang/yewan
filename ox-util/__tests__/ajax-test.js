import {xhrRequest, fetchRequest} from '../src/ajax';

describe('test fetchRequest', () => {
    it('set options correctly', () => {
        var initParam;
        var fetchMock = jest.fn(() =>
            Promise.resolve(Promise.resolve({ok: false, status: 500}))
        );
        var abortControllerMock = jest.fn(() => {
            return {
                signal: '三上悠亚',
                abort: jest.fn()
            };
        });

        fetchRequest(
            'https://m.6.cn/jslog',
            {
                method: 'POST',
                data: {
                    a: 1,
                    b: ['one', 'two']
                },
                timeout: 3000,
                withCredentials: true
            },
            {fetch: fetchMock, AbortController: abortControllerMock}
        ).catch((err) => {
            // pass
        });
        initParam = fetchMock.mock.calls[0][1];
        expect(fetchMock.mock.calls[0][0]).toBe('https://m.6.cn/jslog');
        expect(initParam.method).toBe('POST');
        expect(initParam.body).toBe('a=1&b[]=one&b[]=two');
        expect(initParam.signal).toBe('三上悠亚');
        expect(initParam.credentials).toBe('include');
        expect(abortControllerMock.mock.calls.length).toBe(1);

        fetchRequest(
            'https://v.6.cn/?page=1',
            {
                data: {
                    uid: '2'
                }
            },
            {fetch: fetchMock, AbortController: abortControllerMock}
        ).catch((e) => {
            // pass
        });
        initParam = fetchMock.mock.calls[1][1];
        expect(fetchMock.mock.calls[1][0]).toBe('https://v.6.cn/?page=1&uid=2');
        expect(initParam.credentials).toBe(undefined);
        expect(abortControllerMock.mock.calls.length).toBe(2);
    });

    it('handle response', () => {
        var fetchMock = jest.fn(() => {
            var response = {
                ok: true,
                text: jest.fn(() => Promise.resolve('text')),
                json: jest.fn(() => Promise.resolve({name: 'x'}))
            };
            return Promise.resolve(response);
        });

        fetchRequest('/', undefined, {
            fetch: fetchMock,
            AbortController: jest.fn()
        }).then((data) => {
            expect(data.name).toBe('x');
        });
        fetchRequest(
            '/',
            {dataType: 'text'},
            {
                fetch: fetchMock,
                AbortController: jest.fn()
            }
        ).then((data) => {
            expect(data).toBe('text');
        });
        fetchRequest(
            '/',
            {context: {id: 'xx'}},
            {fetch: fetchMock, AbortController: jest.fn()}
        ).then((data) => {
            expect(data.response.name).toBe('x');
            expect(data.context.id).toBe('xx');
        });
    });

    it('handle HTTPError', () => {
        var fetchMock = jest.fn(() => {
            return Promise.resolve({
                ok: false,
                status: 401
            });
        });

        fetchRequest(
            '/eva',
            {data: {a: 1}},
            {fetch: fetchMock, AbortController: jest.fn()}
        )
            .then(() => {
                expect(true).toBe(false);
            })
            .catch((err) => {
                expect(err.toString()).toContain('HTTPError401');
                expect(err.url).toBe('/eva?a=1');
            });
    });

    it('handle NetworkError', () => {
        var fetchMock = jest.fn(() => {
            return Promise.reject(new Error('xx'));
        });

        fetchRequest('/bob', undefined, {
            fetch: fetchMock,
            AbortController: jest.fn()
        }).then(
            () => {
                expect(true).toBe(false);
            },
            (e) => {
                expect(e.url).toBe('/bob');
                expect(e.toString()).toContain('NetworkError');
            }
        );
    });

    it('handle timeout', (done) => {
        var fetchMock = jest.fn(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        status: 200,
                        json: jest.fn(() => {
                            return Promise.resolve({name: 'x'});
                        })
                    });
                }, 3000);
            });
        });
        var abortControllerInstance = {
            abort: jest.fn()
        };
        var abortControllerMock = jest.fn(() => {
            return abortControllerInstance;
        });

        fetchRequest(
            '/',
            {timeout: 1000, context: {id: 'c'}},
            {fetch: fetchMock, AbortController: abortControllerMock}
        ).then(
            () => {
                expect(true).toBe(false);
            },
            (err) => {
                expect(err.context.id).toBe('c');
                expect(err.toString()).toContain('TimeoutError');
                expect(abortControllerInstance.abort.mock.calls.length).toBe(1);
            }
        );

        fetchRequest(
            '/',
            {},
            {fetch: fetchMock, AbortController: abortControllerMock}
        ).then((data) => {
            expect(data.name).toBe('x');
            done();
        });
    });

    it('handle abort', () => {
        var fetchMock = jest.fn(() => {
            return new Promise((resolve, reject) => {
                resolve({
                    ok: true,
                    json: jest.fn(() => {
                        return Promise.resolve({name: 'y'});
                    })
                });
            });
        });
        var abortControllerInstance = {
            abort: jest.fn()
        };
        var abortControllerMock = jest.fn(() => abortControllerInstance);

        var reqeust = fetchRequest('/', undefined, {
            fetch: fetchMock,
            AbortController: abortControllerMock
        });
        reqeust.abort();
        reqeust.then((data) => {
            expect(data.name).toBe('y');
        });
        expect(abortControllerInstance.abort.mock.calls.length).toBe(1);
    });
});

describe('test xhrRequest', () => {
    var createXhrMock = function (obj = {}) {
        return Object.assign(
            {
                open: jest.fn(),
                send: jest.fn(),
                abort: jest.fn(),
                setRequestHeader: jest.fn(),
                status: 0,
                statusText: '200 OK',
                reponseText: '',
                timeout: 0,
                withCredentials: true
            },
            obj
        );
    };

    it('set properties of xhr object correctly', () => {
        var xhr = createXhrMock();
        xhrRequest(
            'http://m.6.cn/api/test',
            {
                method: 'POST',
                data: {
                    a: 1,
                    b: ['one', 'two']
                },
                timeout: 3000,
                withCredentials: true
            },
            () => xhr
        );
        expect(xhr.timeout).toBe(3000);
        expect(xhr.withCredentials).toBe(true);
        expect(xhr.open.mock.calls.length).toBe(1);
        expect(xhr.open.mock.calls[0][0]).toBe('POST');
        expect(xhr.open.mock.calls[0][1]).toBe('http://m.6.cn/api/test');
        expect(xhr.open.mock.calls[0][2]).toBe(true);
        expect(xhr.send.mock.calls.length).toBe(1);
        expect(xhr.send.mock.calls[0][0]).toBe('a=1&b[]=one&b[]=two');
        expect(xhr.setRequestHeader.mock.calls[0][0]).toBe('Content-Type');
        expect(xhr.setRequestHeader.mock.calls[0][1]).toBe(
            'application/x-www-form-urlencoded; charset=UTF-8'
        );
        expect(xhr.onload).toBe(xhr.onerror);
        expect(xhr.onerror).toBe(xhr.ontimeout);

        xhr = createXhrMock();
        xhrRequest(
            'https://www.6.cn',
            {
                data: {
                    act: 'add',
                    uid: '111',
                    name: '张三'
                }
            },
            () => xhr
        );
        expect(xhr.timeout).toBe(0);
        expect(xhr.withCredentials).toBe(false);
        expect(xhr.open.mock.calls.length).toBe(1);
        expect(xhr.open.mock.calls[0][0]).toBe('GET');
        expect(xhr.open.mock.calls[0][1]).toBe(
            'https://www.6.cn?act=add&uid=111&name=%E5%BC%A0%E4%B8%89'
        );
        expect(xhr.open.mock.calls[0][2]).toBe(true);
        expect(xhr.send.mock.calls.length).toBe(1);
        expect(xhr.send.mock.calls[0][0]).toBe(null);
    });

    it('handle right response', () => {
        expect.assertions(4);

        var xhr1 = createXhrMock({
            response: {a: 1, b: 2},
            status: 200
        });
        var promise1 = xhrRequest('', {}, () => xhr1);
        xhr1.onload({type: 'load'});
        promise1.then((data) => {
            expect(data).toEqual({
                a: 1,
                b: 2
            });
        });

        var xhr2 = createXhrMock({
            status: 304,
            response: '假装是XML'
        });
        var promise2 = xhrRequest(
            '',
            {
                dataType: 'document'
            },
            () => xhr2
        );
        xhr2.onload({type: 'load'});
        promise2.then((data) => {
            expect(data).toBe('假装是XML');
        });

        var xhr3 = createXhrMock({
            status: 200,
            response: 'plain text'
        });
        var promise3 = xhrRequest(
            '',
            {
                dataType: 'text',
                context: {
                    contextID: '111'
                }
            },
            () => xhr3
        );
        xhr3.onload({type: 'load'});
        promise3.then((data) => {
            expect(data.response).toBe('plain text');
            expect(data.context).toEqual({
                contextID: '111'
            });
        });
    });

    it('handle HTTPError', () => {
        expect.assertions(4);

        var xhr = createXhrMock({
            status: 302
        });
        var promise = xhrRequest('/api/get-user-info', {}, () => xhr);
        xhr.onload({type: 'load'});
        promise.catch((err) => {
            expect(err.name).toBe('AjaxError');
            expect(err.type).toBe('HTTPError302');
            expect(err.url).toBe('/api/get-user-info');
            expect(err.message).toBe('HTTPError302: /api/get-user-info');
        });
    });

    it('handle TimeoutError', () => {
        expect.assertions(2);

        var xhr = createXhrMock({
            status: 200
        });
        var promise = xhrRequest(
            '/api/msg',
            {
                timeout: 1000
            },
            () => xhr
        );
        xhr.ontimeout({type: 'timeout'});
        promise.then(null, (err) => {
            expect(err.message).toBe('TimeoutError: /api/msg');
            expect(xhr.timeout).toBe(1000);
        });
    });

    it('handle ParseJSONError', () => {
        expect.assertions(3);

        var xhr = createXhrMock({
            status: 200,
            responseText: '<body></body>',
            response: null
        });
        var promise = xhrRequest('/json', {}, () => xhr);
        xhr.onload({type: 'load'});
        promise.catch((err) => {
            expect(err.type.indexOf('ParseJSONError')).toBe(0);
            expect(err.toString()).toBe(
                'AjaxError: ParseJSONError <body></body>: /json'
            );
            expect(err.url).toBe('/json');
        });
    });

    it('handle AbortedManuallyError', () => {
        expect.assertions(2);

        var xhr = createXhrMock();
        var promise = xhrRequest('', {}, () => xhr);
        promise.abort();
        expect(xhr.abort.mock.calls.length).toBe(1);
        promise.catch((err) => {
            expect(err.type).toBe('AbortedManuallyError');
        });
    });

    it('handle NetworkError', () => {
        expect.assertions(1);

        var xhr = createXhrMock();
        var promise = xhrRequest('', {}, () => xhr);
        xhr.onerror({type: 'error'});
        promise.catch((err) => {
            expect(err.type).toBe('NetworkError');
        });
    });
});
