import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { NgControlAccessor } from './ng-control-accessor';

class MockNgControl extends NgControl {
    public get control(): AbstractControl | null {
        return null;
    }

    public viewToModelUpdate(newValue: any): void {
        // Empty
    }
}

describe('NgControlAccessor', () => {
    describe('constructor', () => {
        it('should create', () => {
            const directive = new NgControlAccessor(null);
            expect(directive).toBeTruthy();
        });

        it('should create and set valueAccessor', () => {
            const ngControl: NgControl = new MockNgControl();
            const directive: ControlValueAccessor = new NgControlAccessor(ngControl);
            expect(directive).toBeTruthy();
            expect(ngControl.valueAccessor).toEqual(directive);
        });
    });
});
