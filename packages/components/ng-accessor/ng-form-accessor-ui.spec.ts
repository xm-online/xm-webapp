import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    public testForm: FormControl;
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

    xdescribe('value', () => {
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
            }),
        );

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
            tick()
            expect(child.value).toBe(value);

            container.testValue = newValue;
            fixture.detectChanges();
            tick()
            expect(child.value).toBe(newValue);
            expect(spy).not.toHaveBeenCalled();
        }));
    });

    describe('formControl', () => {
        it('value passes to control', fakeAsync(() => {
            const value = 'value';
            const template = '<test-accessor [formControl]="testForm"></test-accessor>';
            const fixture = createTestComponent(template);
            const container = fixture.componentInstance;
            container.testForm = new FormControl()
            fixture.detectChanges();
            const child = fixture.componentInstance.child;
            container.testForm.patchValue(value);
            fixture.detectChanges();

            expect(child.value).toBe(value);
        }));

        it('new value not triggers a valueChange', () => {
            const value = 'value';
            const newValue = 'newValue';
            const template = '<test-accessor [formControl]="testForm"></test-accessor>';
            const fixture = createTestComponent(template);

            const container = fixture.componentInstance;
            container.testForm = new FormControl()
            fixture.detectChanges();
            const child = fixture.componentInstance.child;
            const spy = spyOn(child.valueChange, 'emit');

            container.testForm.patchValue(value);
            fixture.detectChanges();
            expect(child.value).toBe(value);

            container.testForm.patchValue(newValue);
            fixture.detectChanges();
            expect(child.value).toBe(newValue);
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
