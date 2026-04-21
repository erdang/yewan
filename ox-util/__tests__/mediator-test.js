import mediator from '../src/mediator.js';

describe('test mediator', function () {
    it('works', () => {
        var callback = jest.fn();
        var callback2 = jest.fn();

        mediator.subscribe('test', callback);
        mediator.publish('test', 1, 2, 'x');
        expect(callback.mock.calls.length).toBe(1);
        expect(callback.mock.calls[0][0]).toBe(1);
        expect(callback.mock.calls[0][1]).toBe(2);
        expect(callback.mock.calls[0][2]).toBe('x');
        mediator.publish('test', [1, 2]);
        expect(callback.mock.calls.length).toBe(2);
        expect(callback.mock.calls[1][0].join()).toBe('1,2');
        mediator.unsubscribe('test', callback);
        mediator.publish('test', 'y');
        expect(callback.mock.calls.length).toBe(2);
        mediator.subscribe('test', callback2);
        mediator.unsubscribe('test');
        mediator.publish('test', 'z');
        expect(callback2.mock.calls.length).toBe(0);
    });
});
