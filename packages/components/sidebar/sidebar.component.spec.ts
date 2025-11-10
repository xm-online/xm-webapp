import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { XmSidebarStoreService } from './stores/xm-sidebar-store.service';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { MockUiConfigService } from '@xm-ngx/core/config/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { of } from 'rxjs';

import { XmSidebarComponent } from './sidebar.component';
import {
    AuthRefreshTokenService,
    StateStorageService,
    XmAuthenticationConfig,
    XmAuthenticationStoreService,
    XmAuthTargetUrlService,
} from '@xm-ngx/core/auth';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { DashboardStore } from '@xm-ngx/core/dashboard';

describe('XmSidebarComponent', () => {
    let component: XmSidebarComponent;
    let fixture: ComponentFixture<XmSidebarComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule, HttpClientTestingModule],
            providers: [
                XmAuthenticationConfig,
                XmAuthenticationStoreService,
                LocalStorageService,
                SessionStorageService,
                AuthRefreshTokenService,
                XmAuthTargetUrlService,
                StateStorageService,
                DashboardStore,
                { provide: XmUiConfigService, useClass: MockUiConfigService },
                { provide: XmSidebarStoreService, useValue: {onPresentationChange:of(null)} },
            ],
            declarations: [XmSidebarComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
