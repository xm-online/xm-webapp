import { transformByMap } from './transform-by-map';

describe('transformByMap', () => {
    it('should transform an one-level', () => {
        const data = { oldName: 'Rex' };
        const map = { newName: 'oldName' };
        const expectation = { newName: 'Rex' };
        const result = transformByMap(data, map);
        expect(result).toEqual(expectation);
    });

    it('should transform multi-level', () => {
        const data = { creds: { login: 'Rex' } };
        const map = { 'credentials.nickname': 'creds.login' };
        const expectation = { credentials: { nickname: 'Rex' } };
        const result = transformByMap(data, map);
        expect(result).toEqual(expectation);
    });

    it('should skip null data', () => {
        const data = { creds: null };
        const map = { 'credentials.nickname': 'creds.login' };
        const expectation = {};
        const result = transformByMap(data, map);
        expect(result).toEqual(expectation);
    });

    it('should skip null sub-data', () => {
        const data = { creds: { login: null } };
        const map = { 'credentials.nickname': 'creds.login' };
        const expectation = {};
        const result = transformByMap(data, map);
        expect(result).toEqual(expectation);
    });

    it('should skip undefined sub-data', () => {
        const data = { creds: { login: undefined } };
        const map = { 'credentials.nickname': 'creds.login' };
        const expectation = {};
        const result = transformByMap(data, map);
        expect(result).toEqual(expectation);
    });

    it('should pass false sub-data', () => {
        const data = { creds: { login: false } };
        const map = { 'credentials.nickname': 'creds.login' };
        const expectation = { credentials: { nickname: false } };
        const result = transformByMap(data, map);
        expect(result).toEqual(expectation);
    });
});
