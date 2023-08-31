import { Defaults } from './defaults';

describe('Defaults Decorator', () => {
    class TestClass {
        @Defaults('defaultStringValue')
        public myString: string;

        @Defaults(0)
        public myNumber: number;

        @Defaults(null)
        public myNull: object | null;

        @Defaults({ key: 'defaultValue' })
        public myObject: { key: string };
    }

    let instance: TestClass;

    beforeEach(() => {
        instance = new TestClass();
    });

    it('should set default string value', () => {
        void expect(instance.myString).toEqual('defaultStringValue');
    });

    it('should set default null value', () => {
        void expect(instance.myNull).toEqual(null);
    });

    it('should set default number value', () => {
        void expect(instance.myNumber).toEqual(0);
    });

    it('should set default object value', () => {
        void expect(instance.myObject).toEqual({ key: 'defaultValue' });
    });

    it('should allow setting a new string value', () => {
        instance.myString = 'newStringValue';
        void expect(instance.myString).toEqual('newStringValue');
    });

    it('should allow setting a new number value', () => {
        instance.myNumber = 42;
        void expect(instance.myNumber).toEqual(42);
    });

    it('should allow setting a new object value', () => {
        void expect(instance.myObject).toEqual({ key: 'defaultValue' });
        instance.myObject = { key: 'newValue' };
        void expect(instance.myObject).toEqual({ key: 'newValue' });
    });

    it('should allow setting a new object value', () => {
        void expect(instance.myObject).toEqual({ key: 'defaultValue' });
        instance.myObject = { key: 'newValue2' };
        void expect(instance.myObject).toEqual({ key: 'newValue2' });
    });
});
