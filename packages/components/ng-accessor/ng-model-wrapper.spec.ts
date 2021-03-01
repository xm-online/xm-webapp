import { NgModelWrapper } from './ng-model-wrapper';

describe('NgModelWrapper', () => {
    describe('value', () => {
        it('should create', () => {
            const directive = new NgModelWrapper();
            expect(directive).toBeTruthy();
        });

        it('should set "text" and null', () => {
            const directive = new NgModelWrapper();
            const text = 'text';
            directive.value = text;
            expect(directive.value).toEqual(text);
            directive.value = null;
            expect(directive.value).toBeNull();
        });

        it('should set disabled', () => {
            const directive = new NgModelWrapper();
            directive.disabled = true;
            expect(directive.disabled).toBeTrue();
            directive.disabled = false;
            expect(directive.disabled).toBeFalse();
        });
    });

    describe('writeValue', () => {
        it('should set "text" and null', () => {
            const directive = new NgModelWrapper();
            const text = 'text';
            directive.writeValue(text);
            expect(directive.value).toEqual(text);
            directive.writeValue(null);
            expect(directive.value).toBeNull();
        });
    });

    describe('change', () => {
        it('should emit valueChange', () => {
            const directive = new NgModelWrapper();
            const text = 'text';
            directive.change(text);
            expect(directive.value).toEqual(text);
            directive.writeValue(null);
            directive.valueChange.subscribe((value) => expect(value).toEqual(text));
        });
    });
});
