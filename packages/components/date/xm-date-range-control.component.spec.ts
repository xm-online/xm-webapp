import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    XM_DATE_RANGE_CONTROL_CONFIG_DEFAULT,
    XmDateRangeControl,
    XmDateRangeControlConfig,
    XmDateRangeValueOrString,
} from './xm-date-range-control';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GIVEN XmDateRangeControl', () => {
    let component: XmDateRangeControl;
    let fixture: ComponentFixture<XmDateRangeControl>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                XmDateRangeControl,
                CommonModule,
                MatFormFieldModule,
                MatInputModule,
                ReactiveFormsModule,
                MatDatepickerModule,
                ControlErrorModule,
                HintModule,
                MatButtonModule,
                NoopAnimationsModule,
                MatIconModule,
                XmTranslationTestingModule,
                MatNativeDateModule,
                ControlErrorModule.forRoot(null),
            ],
            providers: [
                { provide: XmTranslatePipe, useValue: { transform: (v) => v } },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(XmDateRangeControl);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('WHEN instance THEN should create the component', () => {
        void expect(component).toBeTruthy();
    });

    it('WHEN set config THEN should display the title in the mat-label', () => {
        const config: XmDateRangeControlConfig = {
            ...XM_DATE_RANGE_CONTROL_CONFIG_DEFAULT,
            title: 'Test Title',
        };

        component.config = config;
        fixture.detectChanges();

        const labelElement: HTMLElement = fixture.nativeElement.querySelector('mat-label');
        void expect(labelElement.textContent.trim()).toBe('Test Title');
    });

    it('WHEN set value object THEN should set the formControl values when writeValue is called', () => {
        const config: XmDateRangeControlConfig = {
            ...XM_DATE_RANGE_CONTROL_CONFIG_DEFAULT,
            valueType: 'object',
        };
        component.config = config;

        const testValue: XmDateRangeValueOrString = {
            from: '2023-07-28T12:34:56',
            to: '2023-07-30T15:45:23',
        };

        component.value = testValue;
        fixture.detectChanges();

        const fromDateControl: FormControl = component.group.get('from') as FormControl;
        const toDateControl: FormControl = component.group.get('to') as FormControl;

        void expect(fromDateControl.value).toEqual(new Date(testValue.from));
        void expect(toDateControl.value).toEqual(new Date(testValue.to));
    });

    it('WHEN set value string THEN should emit the changed value when dateChanged is called', () => {
        const config: XmDateRangeControlConfig = {
            ...XM_DATE_RANGE_CONTROL_CONFIG_DEFAULT,
            title: 'Test Title',
        };

        component.config = config;

        spyOn(component.valueChange, 'next');

        const testValue: XmDateRangeValueOrString = '[ 2023-07-28T12:34:56 TO 2023-07-30T15:45:23 ]';

        component.value = testValue;
        component.dateChanged();

        const fromDateControl: FormControl = component.group.get('from') as FormControl;
        const toDateControl: FormControl = component.group.get('to') as FormControl;

        void expect(fromDateControl.value.getMilliseconds()).toBe(new Date('2023-07-28T12:34:56').getMilliseconds());
        void expect(toDateControl.value.getMilliseconds()).toBe(new Date('2023-07-30T15:45:23').getMilliseconds());
    });

    it('WHEN set defaultValues should set values (using current date) before/after dates', () => {
        const defaultValues = { from: 7, to: 0 };
        const config: XmDateRangeControlConfig = {
            ...XM_DATE_RANGE_CONTROL_CONFIG_DEFAULT,
            defaultValues: defaultValues,
            title: 'Test Title',
        };
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        component.config = config;
        const defaultModel = (component as any).getDefaultModel();
        const expectedFrom = new Date(today);
        expectedFrom.setDate(today.getDate() - defaultValues.from);
        const expectedTo = new Date(today);
        expectedTo.setDate(today.getDate() + defaultValues.to);
        const compareDates = (d1: Date, d2: Date): boolean =>
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();

        expect(compareDates(defaultModel.from, expectedFrom)).toBeTrue();
        expect(compareDates(defaultModel.to, expectedTo)).toBeTrue();
    });
});
