import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { XmPhoneNumberControlComponent } from './xm-phone-number-control.component';

describe('XmPhoneNumberControlComponent', () => {
    let component: XmPhoneNumberControlComponent;
    let fixture: ComponentFixture<XmPhoneNumberControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmSharedTestingModule, NoopAnimationsModule],
            declarations: [XmPhoneNumberControlComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmPhoneNumberControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
