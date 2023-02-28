import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor/ng-form-accessor';

@Component({
    selector: 'test-accessor',
    template: '',
})
export class TestAccessorComponent extends NgFormAccessor<unknown> {
}

@Component({
    selector: 'test-container',
    template: '',
})
export class TestContainer {
    @ViewChild(TestAccessorComponent) public child: TestAccessorComponent;
    public testValue: unknown;
    public testForm: UntypedFormControl;
    public testGroup: UntypedFormGroup;
}

function createTestComponent(template: string): ComponentFixture<TestContainer> {
    return TestBed
        .overrideComponent(TestContainer, { set: { template: template } })
        .createComponent(TestContainer);
}

describe('NgFormAccessorUI', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule],
            declarations: [TestAccessorComponent, TestContainer],
        });
    });

    describe('value', () => {
        it('value passes to control', () => {
            const value = 'value';
            const template = '<test-accessor [value]="testValue"></test-accessor>';
            const fixture = createTestComponent(template);
            const container = fixture.componentInstance;
            fixture.detectChanges();
            const child = fixture.componentInstance.child;
            container.testValue = value;
            fixture.detectChanges();

            expect(child.value).toBe(value);
        });

        it('new value not triggers a valueChange', () => {
            const value = 'value';
            const newValue = 'newValue';
            const template = '<test-accessor [value]="testValue"></test-accessor>';
            const fixture = createTestComponent(template);
            const container = fixture.componentInstance;
            fixture.detectChanges();
            const child = fixture.componentInstance.child;
            const spy = spyOn(child.valueChange, 'emit');

            container.testValue = value;
            fixture.detectChanges();
            expect(child.value).toBe(value);

            container.testValue = newValue;
            fixture.detectChanges();
            expect(child.value).toBe(newValue);
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('ngModel', () => {
        it('value passes to control', fakeAsync(() => {
            const value = 'value';
            const template = '<test-accessor [ngModel]="testValue"></test-accessor>';
            const fixture = createTestComponent(template);
            const container = fixture.componentInstance;
            fixture.detectChanges();
            container.testValue = value;
            const child = fixture.componentInstance.child;
            fixture.detectChanges();
            tick();
            expect(child.value).toBe(value);
        }));

        it('new value not triggers a valueChange', fakeAsync(() => {
            const value = 'value';
            const newValue = 'newValue';
            const template = '<test-accessor [ngModel]="testValue"></test-accessor>';
            const fixture = createTestComponent(template);

            const container = fixture.componentInstance;
            fixture.detectChanges();
            const child = fixture.componentInstance.child;
            const spy = spyOn(child.valueChange, 'emit');

            container.testValue = value;
            fixture.detectChanges();
            tick();
            expect(child.value).toBe(value);

            container.testValue = newValue;
            fixture.detectChanges();
            tick();
            expect(child.value).toBe(newValue);
            expect(spy).not.toHaveBeenCalled();
        }));

        it('new value via child.control triggers ngModel two-way binging', fakeAsync(() => {
            const value = 'value';
            const newValue = 'newValue';
            const template = '<test-accessor [(ngModel)]="testValue"></test-accessor>';
            const fixture = createTestComponent(template);

            const container = fixture.componentInstance;
            fixture.detectChanges();
            const child = fixture.componentInstance.child;
            const spy = spyOn(child.valueChange, 'emit');

            fixture.detectChanges();
            child.control.setValue(value);
            child.control.patchValue(value);
            expect(child.value).toBe(value);
            expect(container.testValue).toBe(value);
            expect(spy).toHaveBeenCalled();

            child.control.patchValue(newValue);
            fixture.detectChanges();
            expect(child.value).toBe(newValue);
            expect(container.testValue).toBe(newValue);
            expect(spy).toHaveBeenCalled();
        }));
    });

    describe('formControl', () => {
        it('value passes to control', fakeAsync(() => {
            const value = 'value';
            const template = '<test-accessor [formControl]="testForm"></test-accessor>';
            const fixture = createTestComponent(template);
            const container = fixture.componentInstance;
            container.testForm = new UntypedFormControl();
            fixture.detectChanges();
            const child = fixture.componentInstance.child;
            container.testForm.patchValue(value);
            fixture.detectChanges();
            expect(child.control).toBe(container.testForm);

            expect(child.value).toBe(value);
        }));

        it('new value not triggers a valueChange', () => {
            const value = 'value';
            const newValue = 'newValue';
            const template = '<test-accessor [formControl]="testForm"></test-accessor>';
            const fixture = createTestComponent(template);

            const container = fixture.componentInstance;
            container.testForm = new UntypedFormControl();
            fixture.detectChanges();
            const child = fixture.componentInstance.child;
            const spy = spyOn(child.valueChange, 'emit');

            container.testForm.patchValue(value);
            fixture.detectChanges();
            expect(child.value).toBe(value);
            expect(child.control).toBe(container.testForm);

            container.testForm.patchValue(newValue);
            fixture.detectChanges();
            expect(child.value).toBe(newValue);
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('formControlName', () => {
        it('value passes to control', fakeAsync(() => {
            const value = 'value';
            const template = '<form [formGroup]="testGroup"><test-accessor formControlName="control"></test-accessor></form>';
            const fixture = createTestComponent(template);
            const container = fixture.componentInstance;
            const control = new UntypedFormControl();
            container.testGroup = new UntypedFormGroup({ control });
            fixture.detectChanges();
            const child = fixture.componentInstance.child;
            container.testGroup.controls.control.patchValue(value);
            fixture.detectChanges();
            expect(child.control).toBe(control);

            expect(child.value).toBe(value);
        }));

        it('new value not triggers a valueChange', () => {
            const value = 'value';
            const newValue = 'newValue';
            const template = '<form [formGroup]="testGroup"><test-accessor formControlName="control"></test-accessor></form>';
            const fixture = createTestComponent(template);

            const container = fixture.componentInstance;
            const control = new UntypedFormControl();
            container.testGroup = new UntypedFormGroup({ control });
            fixture.detectChanges();
            const child = fixture.componentInstance.child;
            const spy = spyOn(child.valueChange, 'emit');

            container.testGroup.controls.control.patchValue(value);
            fixture.detectChanges();
            expect(child.value).toBe(value);

            container.testGroup.controls.control.patchValue(newValue);
            fixture.detectChanges();
            expect(child.control).toBe(control);
            expect(child.value).toBe(newValue);
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
