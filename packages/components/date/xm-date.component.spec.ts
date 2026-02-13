import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { XmDateComponent, XmDateConfig, XmDateValue } from './xm-date.component';
import { SimpleChange } from '@angular/core';

describe('GIVEN XmDateComponent', () => {
    let component: XmDateComponent;
    let fixture: ComponentFixture<XmDateComponent>;

    beforeEach(() => {
        void TestBed.configureTestingModule({
            imports: [XmDateComponent],
            providers: [DatePipe],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(XmDateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('WHEN instance THEN should create the component', () => {
        void expect(component).toBeTruthy();
    });

    it('WHEN set config THEN should display the date using the provided format, timezone, and locale', () => {
        const datePipe: DatePipe = TestBed.inject(DatePipe);

        const testDate: XmDateValue = new Date('2023-07-28T12:34:56'); // Replace with your desired date

        const config: XmDateConfig = {
            format: 'yyyy-MM-dd HH:mm:ss',
            timezone: 'UTC',
            locale: 'en-US',
        };

        component.value = testDate;
        component.config = config;

        component.ngOnChanges({
            value: new SimpleChange(undefined, testDate, true),
            config: new SimpleChange(undefined, config, true),
        });

        fixture.detectChanges();

        const expectedFormattedDate = datePipe.transform(testDate, config.format, config.timezone, config.locale);
        const element: HTMLElement = fixture.nativeElement;
        void expect(element.textContent).toContain(expectedFormattedDate);
    });

    it('WHEN value date THEN should display the date', () => {
        const datePipe: DatePipe = TestBed.inject(DatePipe);

        const testDate: XmDateValue = (new Date('2023-07-28T12:34:56')).toString(); // Replace with your desired date

        const config: XmDateConfig = {
            format: 'yyyy-MM-dd HH:mm:ss',
            timezone: 'UTC',
            locale: 'en-US',
        };

        component.value = testDate;
        component.config = config;

        component.ngOnChanges({
            value: new SimpleChange(undefined, testDate, true),
            config: new SimpleChange(undefined, config, true),
        });

        fixture.detectChanges();

        const expectedFormattedDate = datePipe.transform(testDate, config.format, config.timezone, config.locale);
        const element: HTMLElement = fixture.nativeElement;
        void expect(element.textContent).toContain(expectedFormattedDate);
    });

    it('WHEN value string THEN should display the date', () => {
        const datePipe: DatePipe = TestBed.inject(DatePipe);

        const testDate: XmDateValue = '2023-07-28T12:34:56'; // Replace with your desired date

        const config: XmDateConfig = {
            format: 'yyyy-MM-dd HH:mm:ss',
            timezone: 'UTC',
            locale: 'en-US',
        };

        component.value = testDate;
        component.config = config;

        component.ngOnChanges({
            value: new SimpleChange(undefined, testDate, true),
            config: new SimpleChange(undefined, config, true),
        });

        fixture.detectChanges();

        const expectedFormattedDate = datePipe.transform(testDate, config.format, config.timezone, config.locale);
        const element: HTMLElement = fixture.nativeElement;
        void expect(element.textContent).toContain(expectedFormattedDate);
    });

    it('WHEN value not date string THEN should display the this string', () => {
        const testDate: XmDateValue = '-'; // Replace with your desired date

        const config: XmDateConfig = {
            format: 'yyyy-MM-dd HH:mm:ss',
            timezone: 'UTC',
            locale: 'en-US',
        };

        component.value = testDate;
        component.config = config;

        component.ngOnChanges({
            value: new SimpleChange(undefined, testDate, true),
            config: new SimpleChange(undefined, config, true),
        });

        fixture.detectChanges();

        const expectedValue = '-';
        const element: HTMLElement = fixture.nativeElement;
        void expect(element.textContent).toContain(expectedValue);
    });
});
