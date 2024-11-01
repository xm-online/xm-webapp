import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountService, Principal } from '@xm-ngx/core/user';
import { MockPrincipalService } from '@xm-ngx/core/user/testing';

import { XmUserSecuritySettingsComponent } from './xm-user-security-settings.component';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { XmPermissionService } from '@xm-ngx/core/permission';
import { MockPermissionService } from '@xm-ngx/core/permission/testing';

describe('XmUserSecuritySettingsComponent', () => {
    let component: XmUserSecuritySettingsComponent;
    let fixture: ComponentFixture<XmUserSecuritySettingsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Principal, useClass: MockPrincipalService },
                { provide: AccountService, useValue: null },
                { provide: XmPermissionService, useValue: MockPermissionService },
            ],
            imports: [XmUserSecuritySettingsComponent, XmTranslationTestingModule, HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmUserSecuritySettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
