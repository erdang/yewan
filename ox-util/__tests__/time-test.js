import time, {format, parseSecond, formatSecond} from '../src/time.js';

describe('test time.js', () => {
    var date = new Date(2017, 3, 1, 18, 5, 40);
    var st = date.getTime();

    it('format time stamp', () => {
        expect(time.format(st)).toBe('2017-04-01');
        expect(format(st, 'h:i')).toBe('18:05');
        expect(time.format(st, 'y-m-d h:i')).toBe('2017-04-01 18:05');
        expect(format(st, 'h:i:s')).toBe('18:05:40');
    });

    it('parse seconds', () => {
        expect(parseSecond(1000)).toEqual([0, 0, 16, 40]);
        expect(time.parseSecond(3600)).toEqual([0, 1, 0, 0]);
    });

    it('format h:i:s from seconds', () => {
        expect(formatSecond(1000)).toBe('16:40');
        expect(time.formatSecond(3600)).toBe('01:00:00');
    });
});
