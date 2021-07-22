import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmTextControl } from './xm-text-control';

describe('XmTextControl', () => {
    let component: XmTextControl;
    let fixture: ComponentFixture<XmTextControl>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [XmTextControl],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                XmTranslationTestingModule,
                MatFormFieldModule,
                MatInputModule,
                ReactiveFormsModule,
                ControlErrorModule,
                ControlErrorModule.forRoot(),
                NoopAnimationsModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent<XmTextControl>(XmTextControl);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('value should be equal to form value via writeValue', () => {
        const value = 'value1';
        component.writeValue(value);
        expect(component.value).toBe(value);
        expect(component.control.value).toBe(value);
    });

    it('value should be equal to form value via control', () => {
        const value = 'value2';
        component.control = new FormControl(value);

        expect(component.value).toBe(value);
        expect(component.control.value).toBe(value);
    });

    it('value should be equal to form value after control change', () => {
        const value = 'value3';
        component.control = new FormControl(null);

        expect(component.value).toBeNull();
        expect(component.control.value).toBeNull();

        component.control = new FormControl(value);
        expect(component.value).toBe(value);
        expect(component.control.value).toBe(value);
    });


    it('value should be equal to form value after input value', () => {
        const value = 'value4';
        component.control = new FormControl(null);
        component.control.setValue(value);
        expect(component.value).toBe(value);
        expect(component.control.value).toBe(value);
    });

    it('value should be changed from input', () => {
        const value = 'value5';
        component.options.id = 'id';
        fixture.detectChanges();
        const input: HTMLInputElement = document.getElementById(component.options.id) as HTMLInputElement;
        input.value = value;
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(input.value).toBe(value);
        expect(component.control.value).toBe(value);
        expect(component.value).toBe(value);
    });
});
