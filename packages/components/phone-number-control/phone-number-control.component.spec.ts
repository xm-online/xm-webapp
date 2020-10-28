import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { PhoneNumberControlComponent } from './phone-number-control.component';

describe('PhoneNumberControlComponent', () => {
    let component: PhoneNumberControlComponent;
    let fixture: ComponentFixture<PhoneNumberControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmSharedTestingModule, NoopAnimationsModule],
            declarations: [PhoneNumberControlComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PhoneNumberControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
