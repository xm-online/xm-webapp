import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmLinkButtonComponent } from './xm-link-button.component';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { XmPermissionService } from '@xm-ngx/core/permission';
import { MockPermissionService } from '@xm-ngx/core/permission/testing';
import {
    AuthRefreshTokenService,
    XmAuthTargetUrlService,
    XmAuthenticationConfig,
    XmAuthenticationStoreService,
} from '@xm-ngx/core/auth';

describe('XmLinkButtonComponent', () => {
    let component: XmLinkButtonComponent;
    let fixture: ComponentFixture<XmLinkButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                { provide: XmPermissionService, useValue: MockPermissionService },
                { provide: XmAuthenticationConfig, useValue: {} },
                { provide: XmAuthenticationStoreService, useValue: {} },
                { provide: AuthRefreshTokenService, useValue: {} },
                { provide: XmAuthTargetUrlService, useValue: {} },
            ],
            imports: [XmLinkButtonComponent, XmTranslationTestingModule, HttpClientTestingModule, RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(XmLinkButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
