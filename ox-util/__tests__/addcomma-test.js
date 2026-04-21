import addComma from '../src/addcomma.js';

describe('test addComma', function () {
    it('works', () => {
        expect(addComma(123456)).toBe('123,456');
        expect(addComma('76543210')).toBe('76,543,210');
        expect(addComma('$3234.034')).toBe('$3,234.034');
    });
});
