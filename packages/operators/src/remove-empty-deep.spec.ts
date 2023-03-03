import { removeEmptyDeep } from '@xm-ngx/shared/operators';

describe('removeEmptyDeep', () => {
    it('should transform an one-level', () => {
        const data = { container: 'value' };
        const expectation = { container: 'value' };
        const result = removeEmptyDeep(data);
        expect(result).toEqual(expectation);
    });

    it('should transform multi-level', () => {
        const data = { credentials: { nickname: 'value' } };
        const expectation = { credentials: { nickname: 'value' } };
        const result = removeEmptyDeep(data);
        expect(result).toEqual(expectation);
    });

    it('should apply null data', () => {
        const data = { credentials: null };
        const expectation = { credentials: null };
        const result = removeEmptyDeep(data);
        expect(result).toEqual(expectation);
    });

    it('should remove empty string data', () => {
        const data = { credentials: '' };
        const expectation = {};
        const result = removeEmptyDeep(data);
        expect(result).toEqual(expectation);
    });

    it('should remove empty string multi-level data', () => {
        const data = { credentials: { nickname: '' } };
        const expectation = { credentials: {} };
        const result = removeEmptyDeep(data);
        expect(result).toEqual(expectation);
    });

    it('should apply undefined data', () => {
        const data = { credentials: undefined };
        const expectation = {};
        const result = removeEmptyDeep(data);
        expect(result).toEqual(expectation);
    });

    it('should apply false bool', () => {
        const data = { credentials: false };
        const expectation = { credentials: false };
        const result = removeEmptyDeep(data);
        expect(result).toEqual(expectation);
    });
});
