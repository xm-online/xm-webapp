import { flattenObject } from '@xm-ngx/shared/operators';

describe('flattenObject', () => {
    it('shouldn`t change object', () => {
        const data = { typeKey: 'TEST.TYPEKEY' };
        const expectation = { typeKey: 'TEST.TYPEKEY' };
        const result = flattenObject(data);
        expect(result).toEqual(expectation);
    });

    it('should transform  object to one-level object', () => {
        const data = {
            typeKey: 'TEST.TYPEKEY',
            data: {
                user: 'test',
            },
        };
        const expectation = { typeKey: 'TEST.TYPEKEY', 'data.user': 'test' };
        const result = flattenObject(data);
        expect(result).toEqual(expectation);
    });

    it('should transform  object to one-level object', () => {
        const data = {
            typeKey: 'TEST.TYPEKEY',
            'data.user': {
                user: 'test',
            },
        };
        const expectation = { typeKey: 'TEST.TYPEKEY', 'data.user.user': 'test' };
        const result = flattenObject(data);
        expect(result).toEqual(expectation);
    });
});
