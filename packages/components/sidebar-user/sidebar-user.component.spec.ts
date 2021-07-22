import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { XmUserService } from '@xm-ngx/core/user';
import { DashboardStore } from '@xm-ngx/dashboard';
import { MockDashboardStore } from '@xm-ngx/dashboard/testing';
import { MockUserService } from '@xm-ngx/core/user/testing';

import { SidebarUserComponent } from './sidebar-user.component';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

describe('SidebarUserComponent', () => {
    let component: SidebarUserComponent;
    let fixture: ComponentFixture<SidebarUserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [XmTranslationTestingModule, HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule],
            declarations: [SidebarUserComponent],
            providers: [
                { provide: DashboardStore, useClass: MockDashboardStore },
                { provide: XmUserService, useClass: MockUserService },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
