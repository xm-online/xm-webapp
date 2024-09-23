import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XmDateRangeComponent, XmDateRangeConfig } from './xm-date-range.component';
import { XmDateValue } from '@xm-ngx/components/date';
import { XmDatePipe } from '@xm-ngx/translation';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { XmAuthenticationService } from '@xm-ngx/core/auth';
import { MockXmAuthenticationService } from '@xm-ngx/core/user/testing';
import { DatePipe } from '@angular/common';

describe('GIVEN XmDateRangeComponent', () => {
    let component: XmDateRangeComponent;
    let fixture: ComponentFixture<XmDateRangeComponent>;
    const xmDatePipe = jasmine.createSpyObj('xmDatePipe', ['transform']);
    const testStartDate: XmDateValue = new Date('Fri, 28 Jul 2023 12:34:56 GMT');
    const testEndDate: XmDateValue = new Date('Sun, 30 Jul 2023 15:45:23 GMT');


    beforeEach(() => {
        void TestBed.configureTestingModule({
            imports: [
                XmDateRangeComponent,
                HttpClientTestingModule,
            ],
            providers: [
                DatePipe,
                { provide: XmAuthenticationService, useValue: MockXmAuthenticationService },
                { provide: XmDatePipe, useValue: xmDatePipe },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent<XmDateRangeComponent>(XmDateRangeComponent);
        component = fixture.componentInstance;
        const mockValue = { from: new Date(), to: new Date() };

        component.value = mockValue;
        fixture.detectChanges();
    });

    it('WHEN instance THEN should create the component', () => {
        void expect(component).toBeTruthy();
    });

    it('WHEN set config THEN should display the date range using the provided format, timezone, and locale', () => {
        const datePipe: XmDatePipe = TestBed.inject(XmDatePipe);

        const config: XmDateRangeConfig = {
            format: 'yyyy-MM-dd HH:mm:ss',
            timezone: 'UTC',
            locale: 'en-US',
            separator: ' to ',
        };

        component.value = {from: testStartDate, to: testEndDate};
        component.config = config;
        fixture.detectChanges();

        xmDatePipe.transform.and.returnValue('2023-07-28 12:34:56');
        const expectedFormattedStartDate = datePipe.transform(testStartDate, config.format, config.timezone, config.locale);
        xmDatePipe.transform.and.returnValue('2023-07-30 15:45:23');
        const expectedFormattedEndDate = datePipe.transform(testEndDate, config.format, config.timezone, config.locale);
        const element: HTMLElement = fixture.nativeElement;
        const displayedText = element.textContent.trim();
        void expect(displayedText).toBe(`${expectedFormattedStartDate}${config.separator}${expectedFormattedEndDate}`);
    });

    it('WHEN value date THEN should display the date', () => {
        const datePipe: XmDatePipe = TestBed.inject(XmDatePipe);

        const config: XmDateRangeConfig = {
            format: 'yyyy-MM-dd HH:mm:ss',
            timezone: 'UTC',
            locale: 'en-US',
            separator: ' to ',
        };

        component.value = {from: testStartDate, to: testEndDate};
        component.config = config;
        fixture.detectChanges();

        xmDatePipe.transform.and.returnValue('2023-07-28 12:34:56');
        const expectedFormattedStartDate = datePipe.transform(testStartDate, config.format, config.timezone, config.locale);
        xmDatePipe.transform.and.returnValue('2023-07-30 15:45:23');
        const expectedFormattedEndDate = datePipe.transform(testEndDate, config.format, config.timezone, config.locale);
        const element: HTMLElement = fixture.nativeElement;
        const displayedText = element.textContent.trim();
        void expect(displayedText).toBe(`${expectedFormattedStartDate}${config.separator}${expectedFormattedEndDate}`);
    });

    it('WHEN value string THEN should display the date', () => {
        const datePipe: XmDatePipe = TestBed.inject(XmDatePipe);

        const config: XmDateRangeConfig = {
            format: 'yyyy-MM-dd HH:mm:ss',
            timezone: 'UTC',
            locale: 'en-US',
            separator: ' to ',
        };

        component.value = {from: testStartDate, to: testEndDate};
        component.config = config;
        fixture.detectChanges();

        xmDatePipe.transform.and.returnValue('2023-07-28 12:34:56');
        const expectedFormattedStartDate = datePipe.transform(testStartDate, config.format, config.timezone, config.locale);
        xmDatePipe.transform.and.returnValue('2023-07-30 15:45:23');
        const expectedFormattedEndDate = datePipe.transform(testEndDate, config.format, config.timezone, config.locale);
        const element: HTMLElement = fixture.nativeElement;
        const displayedText = element.textContent.trim();
        void expect(displayedText).toBe(`${expectedFormattedStartDate}${config.separator}${expectedFormattedEndDate}`);
    });
});
