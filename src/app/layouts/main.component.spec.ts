import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { XmEventManager, XmSessionService } from '@xm-ngx/core';
import { Principal } from '@xm-ngx/core/user';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { LanguageService } from '@xm-ngx/translation';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';

import { LoginService } from '@xm-ngx/components/login';
import { XmConfigService } from '@xm-ngx/core/config';
import { ModulesLanguageHelper } from '@xm-ngx/translation';
import { XmApplicationConfigService } from '@xm-ngx/core/config';
import { XmMainComponent } from './main.component';
import { XmLoggerService } from '@xm-ngx/logger';
import { MockXmLogger } from '@xm-ngx/logger/testing';
import { DashboardStore } from '@xm-ngx/core/dashboard';

class Mock {
}

class MockedConfig extends Mock {
    public isResolved(): Observable<boolean> {
        return of(true);
    }

    public getAppConfig(): Observable<boolean> {
        return of(true);
    }

    public isMaintenanceProgress(): Observable<boolean> {
        return of(true);
    }
}

describe('XmMainComponent', () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [XmTranslationTestingModule, HttpClientTestingModule, NgxWebstorageModule.forRoot()],
            declarations: [XmMainComponent],
            providers: [
                XmEventManager,
                {
                    provide: XmApplicationConfigService,
                    useClass: Mock,
                },
                {
                    provide: XmSessionService,
                    useClass: Mock,
                },
                {
                    provide: LanguageService,
                    useClass: Mock,
                },
                {
                    provide: TranslateService,
                    useClass: Mock,
                },
                {
                    provide: Router,
                    useClass: Mock,
                },
                {
                    provide: Principal,
                    useClass: Mock,
                },
                {
                    provide: ModulesLanguageHelper,
                    useClass: Mock,
                },
                {
                    provide: XmApplicationConfigService,
                    useClass: MockedConfig,
                },
                {
                    provide: XmConfigService,
                    useClass: MockedConfig,
                },
                {
                    provide: LoginService,
                    useClass: Mock,
                },
                { provide: XmLoggerService, useClass: MockXmLogger },
                { provide: DashboardStore, useClass: Mock },
            ],
        }).compileComponents();
    }));
    it('should create the app', waitForAsync(() => {
        const fixture = TestBed.createComponent(XmMainComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
