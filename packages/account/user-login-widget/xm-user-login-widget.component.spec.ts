import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmUserService } from '@xm-ngx/core/user';
import { MockUserService } from '@xm-ngx/core/user/testing';

import { XmUserLoginWidgetComponent } from './xm-user-login-widget.component';

describe('XmUserLoginWidgetComponent', () => {
    let component: XmUserLoginWidgetComponent;
    let fixture: ComponentFixture<XmUserLoginWidgetComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: XmUserService, useClass: MockUserService }],
            imports: [XmUserLoginWidgetComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmUserLoginWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
