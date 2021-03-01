import { fakeAsync } from '@angular/core/testing';
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
    describe('FormControlDirective passes FormControl via constructor', () => {
        it('change() sets value to FormControl and emits valueChange', () => {
            const newValue = 'newValue';
            const control = new FormControl();
            const controlDirective = new FormControlDirective(null, null, null, null);
            spyOnProperty(controlDirective, 'control', 'get').and.returnValue(control);

            const directive = new NgFormAccessor(controlDirective);
            directive.ngOnInit();

            directive.valueChange.subscribe((v) => {
                expect(v).toEqual(newValue);
            });
            const spy = spyOn(directive.valueChange, 'emit');

            directive.change(newValue);
            expect(spy).toHaveBeenCalled();

            expect(directive.value).toEqual(newValue);
            expect(control.value).toEqual(newValue);
        });

        it('FormControl valueChange triggers writeValue() and not emits valueChange', fakeAsync(() => {
            const newValue = 'newValue';
            const control = new FormControl();
            const controlDirective = new FormControlDirective(null, null, null, null);
            spyOnProperty(controlDirective, 'control', 'get').and.returnValue(control);

            const directive = new NgFormAccessor(controlDirective);
            directive.ngOnInit();

            const spy = spyOn(directive.valueChange, 'emit');
            const spy2 = spyOn(directive, 'writeValue');

            control.patchValue(newValue);

            expect(spy2).toHaveBeenCalled();
            expect(spy).not.toHaveBeenCalled();
            expect(control.value).toEqual(newValue);
            expect(directive.value).toEqual(newValue);
        }));
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
