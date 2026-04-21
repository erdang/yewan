import timer, {Timer} from '../src/timer.js';

beforeEach(() => {
    jest.useFakeTimers('legacy');
});

describe('timer', () => {
    it('set correctly', () => {
        var callback = jest.fn();
        var result = timer.set('stark', callback, 1000);

        expect(typeof result).toBe('number');
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(callback, 1000);
        expect(callback).not.toBeCalled();
        jest.runAllTimers();
        expect(callback).toBeCalled();
    });

    it('set duplicate key correctly', () => {
        var callback1 = jest.fn();
        var callback2 = jest.fn();
        var timerID = null;

        timerID = timer.set('lannister', callback1, 2000);
        expect(setTimeout).toHaveBeenCalledWith(callback1, 2000);
        expect(callback1).not.toBeCalled();
        timer.set('lannister', callback2, 1000);
        expect(setTimeout).toHaveBeenCalledWith(callback2, 1000);
        expect(callback2).not.toBeCalled();
        expect(clearTimeout).toHaveBeenCalledWith(timerID);
        jest.runAllTimers();
        expect(callback2).toBeCalled();
        expect(callback1).not.toBeCalled();
    });

    it('get timer id', () => {
        expect(typeof timer.get('stark')).toBe('number');
        expect(timer.get('targaryen')).toBe(undefined);
    });

    it('clear timer', () => {
        var callback = jest.fn();
        var timerID;

        timerID = timer.set('targaryen', callback, 3000);
        expect(setTimeout).toHaveBeenCalledWith(callback, 3000);
        timer.clear('targaryen');
        expect(clearTimeout).toHaveBeenCalledWith(timerID);
        expect(timer.get('targaryen')).toBe(undefined);
        jest.runAllTimers();
        expect(callback).not.toBeCalled();
    });

    it('clear all timer', () => {
        var callback1 = jest.fn();
        var callback2 = jest.fn();
        var callback3 = jest.fn();
        var callback4 = jest.fn();

        timer.set('stark', callback1, 1000);
        timer.set('targaryen', callback2, 2000);
        timer.set('lannister', callback3, 1000);
        timer.set('tarly', callback4, 3000);
        expect(Object.keys(timer._timerHolder).length).toBe(4);
        timer.clearAll();
        expect(Object.keys(timer._timerHolder).length).toBe(0);
        jest.runAllTimers();
        expect(callback1).not.toBeCalled();
        expect(callback3).not.toBeCalled();
        timer.set('targaryen', callback1, 1000);
        jest.runAllTimers();
        expect(callback1).toHaveBeenCalledTimes(1);
    });

    it('use default key', () => {
        var callback1 = jest.fn();
        var timerID;

        timerID = timer.set(callback1, 1000);
        expect(typeof timerID).toBe('number');
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(callback1, 1000);
        expect(callback1).not.toBeCalled();
        jest.runAllTimers();
        expect(callback1).toBeCalled();
        expect(timer.get()).toBe(timerID);
        timerID = timer.set(callback1, 2000);
        timer.clear();
        jest.runAllTimers();
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(timer.get()).toBe(undefined);
        timerID = timer.set(callback1, 1000);
        timer.clearAll();
        jest.runAllTimers();
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(Object.keys(timer._timerHolder).length).toBe(0);
    });

    it('export correctly', () => {
        expect(timer instanceof Timer).toBe(true);
    });
});
