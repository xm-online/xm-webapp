import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockUserService } from '@xm-ngx/core/user/testing';
import { SidebarUserComponent } from './sidebar-user.component';
import { DashboardStore } from '@xm-ngx/dashboard';
import { MockDashboardStore } from '@xm-ngx/dashboard/testing';
import { XmUserService } from '@xm-ngx/core/user';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';


describe('SidebarUserComponent', () => {
    let component: SidebarUserComponent;
    let fixture: ComponentFixture<SidebarUserComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                NoopAnimationsModule,
                SidebarUserComponent,
                XmTranslationTestingModule
            ],
            providers: [
                { provide: DashboardStore, useClass: MockDashboardStore },
                { provide: XmUserService, useClass: MockUserService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
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
