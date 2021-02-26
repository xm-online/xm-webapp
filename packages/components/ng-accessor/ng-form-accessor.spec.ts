import { FormControl, FormControlDirective } from '@angular/forms';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor/ng-form-accessor';

describe('NgFormAccessor', () => {
    describe('constructor', () => {
        it('should create', () => {
            const directive = new NgFormAccessor(null);
            expect(directive).toBeTruthy();
        });

        it('should create and set control', () => {
            const control = new FormControl();
            const ngControl: FormControlDirective = new FormControlDirective(null, null, null, null);
            const spy = spyOnProperty(ngControl, 'control').and.returnValue(control);
            const directive = new NgFormAccessor(ngControl);
            expect(directive).toBeTruthy();
            expect(ngControl.valueAccessor).toEqual(directive);
            expect(spy).not.toHaveBeenCalled();
            expect(ngControl.control).not.toEqual(directive.control);
        });
    });

    describe('control', () => {
        it('new value triggers a valueChange', () => {
            const control = new FormControl();
            const directive = new NgFormAccessor(null);
            directive.control = control;

            const newValue = 'newValue';
            directive.valueChange.subscribe((value) => {
                expect(value).toEqual(newValue);
            });

            control.setValue(newValue);
            expect(directive.value).toEqual(newValue);
        });

        it('same value triggers a valueChange', () => {
            const sameValue = 'sameValue';
            const control = new FormControl(sameValue);
            const directive = new NgFormAccessor(null);
            directive.control = control;

            const spy = spyOn(directive.valueChange, 'emit');
            expect(spy).not.toHaveBeenCalled();

            control.setValue(sameValue);
            expect(directive.value).toEqual(sameValue);
        });
    });

    describe('value', () => {
        it('new value triggers a valueChange', () => {
            const control = new FormControl();
            const directive = new NgFormAccessor(null);
            directive.control = control;

            const newValue = 'newValue';
            directive.valueChange.subscribe((value) => {
                expect(value).toEqual(newValue);
            });

            directive.value = newValue;
            expect(directive.value).toEqual(newValue);
        });

        it('same value triggers a valueChange', () => {
            const sameValue = 'sameValue';
            const control = new FormControl(sameValue);
            const directive = new NgFormAccessor(null);
            directive.control = control;

            const spy = spyOn(directive.valueChange, 'emit');
            expect(spy).not.toHaveBeenCalled();

            directive.value = sameValue;
            expect(directive.value).toEqual(sameValue);
        });
    });

    describe('change', () => {
        it('new value triggers a valueChange', () => {
            const control = new FormControl();
            const directive = new NgFormAccessor(null);
            directive.control = control;

            const newValue = 'newValue';
            directive.valueChange.subscribe((value) => {
                expect(value).toEqual(newValue);
            });

            directive.change(newValue);
            expect(directive.value).toEqual(newValue);
        });

        it('same value not triggers a valueChange', () => {
            const sameValue = 'sameValue';
            const control = new FormControl(sameValue);
            const directive = new NgFormAccessor(null);
            directive.control = control;

            const spy = spyOn(directive.valueChange, 'emit');
            expect(spy).not.toHaveBeenCalled();

            directive.change(sameValue);
            expect(directive.value).toEqual(sameValue);
        });
    });
});
