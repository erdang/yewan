import {Histo} from '../src/histo.js';
import urltool from '../src/url.js';

function mockLocation(url) {
    return urltool.parse(url);
}

describe('test Histo Class', () => {
    test('getPath', () => {
        var histo = new Histo();

        histo._getLocation = function () {
            return mockLocation('http://m.v.6.cn/');
        };
        expect(histo.getPath()).toBe('/');

        histo._getLocation = function () {
            return mockLocation('https://m.v.6.cn/123/');
        };
        expect(histo.getPath()).toBe('/123/');

        histo._getLocation = function () {
            return mockLocation('http://m.v.6.cn/123?a=1&b=2');
        };
        expect(histo.getPath()).toBe('/123?a=1&b=2');
    });

    test('push and replace', () => {
        var histo = new Histo();
        var pushHandler = jest.fn();
        var replaceHandler = jest.fn();
        var changeState = histo._changeState;
        var emptyFunc = () => {};

        histo.on('push', pushHandler);
        histo.on('replace', replaceHandler);
        histo._getHistory = function () {
            return {
                pushState: emptyFunc,
                replaceState: emptyFunc
            };
        };
        histo._getLocation = function () {
            return {
                push: emptyFunc,
                assign: emptyFunc
            };
        };
        histo._changeState = jest.fn(changeState);

        histo.push('/100', {alias: 'hundred'});
        histo.replace('/login', {tm: 100});
        histo.push('/200?a=1&b=2');

        expect(pushHandler.mock.calls.length).toBe(2);
        expect(pushHandler.mock.calls[0][0]).toBe('/100');
        expect(pushHandler.mock.calls[1][0]).toBe('/200?a=1&b=2');
        expect(replaceHandler.mock.calls.length).toBe(1);
        expect(replaceHandler.mock.calls[0][0]).toBe('/login');
        expect(histo._changeState.mock.calls.length).toBe(3);
        expect(histo._changeState.mock.calls[0][0]).toBe('/100');
        expect(histo._changeState.mock.calls[0][1].alias).toBe('hundred');
        expect(histo._changeState.mock.calls[0][2]).toBe(undefined);
        expect(histo._changeState.mock.calls[1][0]).toBe('/login');
        expect(histo._changeState.mock.calls[1][1].tm).toBe(100);
        expect(histo._changeState.mock.calls[1][2]).toBe(true);
        expect(histo._changeState.mock.calls[2][0]).toBe('/200?a=1&b=2');
    });

    test('destroy', () => {
        var addEventListener = jest.fn();
        var removeEventListener = jest.fn();
        var mockWindow = {
            addEventListener,
            removeEventListener
        };
        Histo.prototype._getGlobalScope = function () {
            return mockWindow;
        };
        var histo = new Histo();

        histo.destroy();
        expect(addEventListener.mock.calls[0][0]).toBe('popstate');
        expect(addEventListener.mock.calls[0][1]).toBe(histo._popstateHandler);
        expect(addEventListener.mock.calls[0][2]).toBe(false);
        expect(removeEventListener.mock.calls[0][0]).toBe('popstate');
        expect(removeEventListener.mock.calls[0][1]).toBe(
            histo._popstateHandler
        );
        expect(removeEventListener.mock.calls[0][2]).toBe(false);

        Histo.prototype._getGlobalScope = function () {
            return window;
        };
    });

    test('_getPathBaseOnCurrent', () => {
        var histo = new Histo();
        var current;
        var to;

        histo._getLocation = function () {
            return mockLocation('https://m.v.6.cn/100');
        };
        histo._current = histo.getPath();
        current = urltool.parse(histo._current);

        to = urltool.parse('/11181');
        expect(histo._getPathBaseOnCurrent(to, current)).toBe('/11181');

        to = urltool.parse('?overlay=1');
        expect(histo._getPathBaseOnCurrent(to, current)).toBe('/100?overlay=1');
    });

    test('_popstateHandler', () => {
        var histo = new Histo();
        var changeHandler = jest.fn();
        var changeQueryHandler = jest.fn();

        histo._current = '/';
        histo.getPath = function () {
            return '/100';
        };
        histo.on('change', changeHandler);
        histo.on('change-query', changeQueryHandler);
        histo._popstateHandler({});

        expect(changeHandler.mock.calls.length).toBe(1);
        expect(changeQueryHandler.mock.calls.length).toBe(0);
        expect(histo._current).toBe('/100');

        histo.getPath = function () {
            return '/100?overlay=1';
        };
        histo._popstateHandler();

        expect(changeHandler.mock.calls[1][0]).toBe('/100?overlay=1');
        expect(changeQueryHandler.mock.calls.length).toBe(1);
        expect(histo._current).toBe('/100?overlay=1');
    });

    test('_changeState', () => {
        var histo = new Histo();
        var location = {
            assign: jest.fn(),
            replace: jest.fn()
        };
        var history = {
            pushState: jest.fn(),
            replaceState: jest.fn()
        };
        var changeHandler = jest.fn();
        var changeQueryHandler = jest.fn();

        histo._getLocation = function () {
            return location;
        };
        histo._getHistory = function () {
            return history;
        };
        histo.on('change', changeHandler);
        histo.on('change-query', changeQueryHandler);
        histo.push('/100', {name: 'hundred'});
        histo.push('/100?a=1');
        expect(history.pushState.mock.calls[0][0].name).toBe('hundred');
        expect(history.pushState.mock.calls[0][2]).toBe('/100');
        expect(history.pushState.mock.calls[1][2]).toBe('/100?a=1');
        expect(changeHandler.mock.calls.length).toBe(2);
        expect(changeQueryHandler.mock.calls.length).toBe(1);
        histo.replace('/200', {name: 'two-hundreds'});
        histo.push('/200');
        expect(history.replaceState.mock.calls[0][0].name).toBe('two-hundreds');
        expect(history.replaceState.mock.calls[0][2]).toBe('/200');
        expect(location.assign.mock.calls[0][0]).toBe('/200');
        expect(changeHandler.mock.calls[2][0]).toBe('/200');
    });

    test('_changeState when disable SPA', () => {
        var histo = new Histo(true);
        var location = {
            assign: jest.fn(),
            replace: jest.fn()
        };
        histo._getLocation = function () {
            return location;
        };

        histo._changeState('/100');
        histo._changeState('//m.v.6.cn');
        expect(location.assign.mock.calls[0][0]).toBe('/100');
        expect(location.assign.mock.calls[1][0]).toBe('//m.v.6.cn');
        histo._changeState('/200', null, true);
        expect(location.replace.mock.calls[0][0]).toBe('/200');
        expect(histo.spa).toBe(false);
    });
});
