import { flattenObjectDeep, unFlattenObjectDeep } from './flattenObjectDeep';

describe('flattenObjectDeep', () => {
    it('should flatten a deeply nested object with the given prefix', () => {
        const nestedObj = {
            a: {
                b: {
                    c: 1,
                    d: [2, 3, 4],
                },
                e: 'test',
            },
        };
        const prefix = 'prefix.';
        const expectedResult = {
            'prefix.a.b.c': 1,
            'prefix.a.b.d[0]': 2,
            'prefix.a.b.d[1]': 3,
            'prefix.a.b.d[2]': 4,
            'prefix.a.e': 'test',
        };

        const result = flattenObjectDeep(nestedObj, prefix);

        expect(result).toEqual(expectedResult);
    });
});


describe('unFlattenObjectDeep', () => {
    it('should unflatten an object with the given prefix and rebuild its structure', () => {
        const flattenedObj = {
            'prefix.a.b.c': 1,
            'prefix.a.b.d[0]': 2,
            'prefix.a.b.d[1]': 3,
            'prefix.a.b.d[2]': 4,
            'prefix.a.e': 'test',
        };
        const prefix = 'prefix.';
        const expectedResult = {
            a: {
                b: {
                    c: 1,
                    d: [2, 3, 4],
                },
                e: 'test',
            },
        };

        const result = unFlattenObjectDeep(flattenedObj, prefix);
        expect(result).toEqual(expectedResult);
    });
});



