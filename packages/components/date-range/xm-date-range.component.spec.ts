import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { XmDateRangeComponent, XmDateRangeConfig } from './xm-date-range.component';
import { XmDateValue } from '@xm-ngx/components/date';

describe('GIVEN XmDateRangeComponent', () => {
    let component: XmDateRangeComponent;
    let fixture: ComponentFixture<XmDateRangeComponent>;

    beforeEach(() => {
        void TestBed.configureTestingModule({
            imports: [XmDateRangeComponent],
            providers: [DatePipe],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(XmDateRangeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('WHEN instance THEN should create the component', () => {
        void expect(component).toBeTruthy();
    });

    it('WHEN set config THEN should display the date range using the provided format, timezone, and locale', () => {
        const datePipe: DatePipe = TestBed.inject(DatePipe);

        const testStartDate: XmDateValue = new Date('2023-07-28T12:34:56');
        const testEndDate: XmDateValue = new Date('2023-07-30T15:45:23');

        const config: XmDateRangeConfig = {
            format: 'yyyy-MM-dd HH:mm:ss',
            timezone: 'UTC',
            locale: 'en-US',
            separator: ' to ',
        };

        component.value = { from: testStartDate, to: testEndDate };
        component.config = config;
        fixture.detectChanges();

        const expectedFormattedStartDate = datePipe.transform(testStartDate, config.format, config.timezone, config.locale);
        const expectedFormattedEndDate = datePipe.transform(testEndDate, config.format, config.timezone, config.locale);
        const element: HTMLElement = fixture.nativeElement;
        const displayedText = element.textContent.trim();
        void expect(displayedText).toBe(`${expectedFormattedStartDate}${config.separator}${expectedFormattedEndDate}`);
    });

    it('WHEN value date THEN should display the date', () => {
        const datePipe: DatePipe = TestBed.inject(DatePipe);

        const testStartDate: XmDateValue = new Date('2023-07-28T12:34:56');
        const testEndDate: XmDateValue = new Date('2023-07-30T15:45:23');

        const config: XmDateRangeConfig = {
            format: 'yyyy-MM-dd HH:mm:ss',
            timezone: 'UTC',
            locale: 'en-US',
            separator: ' to ',
        };

        component.value = { from: testStartDate, to: testEndDate };
        component.config = config;
        fixture.detectChanges();

        const expectedFormattedStartDate = datePipe.transform(testStartDate, config.format, config.timezone, config.locale);
        const expectedFormattedEndDate = datePipe.transform(testEndDate, config.format, config.timezone, config.locale);
        const element: HTMLElement = fixture.nativeElement;
        const displayedText = element.textContent.trim();
        void expect(displayedText).toBe(`${expectedFormattedStartDate}${config.separator}${expectedFormattedEndDate}`);
    });

    it('WHEN value string THEN should display the date', () => {
        const datePipe: DatePipe = TestBed.inject(DatePipe);

        const testStartDate: XmDateValue = '2023-07-28T12:34:56';
        const testEndDate: XmDateValue = '2023-07-30T15:45:23';

        const config: XmDateRangeConfig = {
            format: 'yyyy-MM-dd HH:mm:ss',
            timezone: 'UTC',
            locale: 'en-US',
            separator: ' to ',
        };

        component.value = { from: testStartDate, to: testEndDate };
        component.config = config;
        fixture.detectChanges();

        const expectedFormattedStartDate = datePipe.transform(testStartDate, config.format, config.timezone, config.locale);
        const expectedFormattedEndDate = datePipe.transform(testEndDate, config.format, config.timezone, config.locale);
        const element: HTMLElement = fixture.nativeElement;
        const displayedText = element.textContent.trim();
        void expect(displayedText).toBe(`${expectedFormattedStartDate}${config.separator}${expectedFormattedEndDate}`);
    });
});
