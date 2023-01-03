import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { XmEventManager, XmSessionService } from '@xm-ngx/core';
import { Principal } from '@xm-ngx/core/auth';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { LanguageService } from '@xm-ngx/translation';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';

import { LoginService, ModulesLanguageHelper, XmConfigService } from '../../shared';
import { XmApplicationConfigService } from '../../shared/spec/xm-config.service';
import { XmMainComponent } from './main.component';
import { XmSidebarStoreService } from '@xm-ngx/components/sidebar';

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
    beforeEach(async(() => {
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
                { provide: XmSidebarStoreService, useValue: {onPresentationChange:of(null)} }
            ],
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(XmMainComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
