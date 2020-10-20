import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmTextControl } from '@xm-ngx/components/xm-text-control/xm-text-control';
import { XmSharedTestingModule } from '@xm-ngx/shared';

describe('XmTextControl', () => {
    let component: XmTextControl;
    let fixture: ComponentFixture<XmTextControl>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [XmTextControl],
            imports: [
                XmSharedTestingModule,
                ControlErrorModule,
                NoopAnimationsModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmTextControl);
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

        const changesObj: SimpleChanges = { control: new SimpleChange(null, component.control, false) };
        component.ngOnChanges(changesObj);
        expect(component.value).toBe(value);
        expect(component.control.value).toBe(value);
    });

    it('value should be equal to form value after control change', () => {
        const value = 'value3';
        component.control = new FormControl(null);

        const changesObj: SimpleChanges = { control: new SimpleChange(null, component.control, false) };
        component.ngOnChanges(changesObj);
        expect(component.value).toBeNull();
        expect(component.control.value).toBeNull();

        component.control = new FormControl(value);
        const changesObj2: SimpleChanges = { control: new SimpleChange(null, component.control, false) };
        component.ngOnChanges(changesObj2);
        expect(component.value).toBe(value);
        expect(component.control.value).toBe(value);
    });


    it('value should be equal to form value after input value', () => {
        const value = 'value4';
        component.control = new FormControl(null);
        component.control.setValue(value);
        const changesObj: SimpleChanges = { control: new SimpleChange(null, component.control, false) };
        component.ngOnChanges(changesObj);
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
        expect(input.value).toBe(value);
        expect(component.control.value).toBe(value);
        expect(component.value).toBe(value);
    });
});
