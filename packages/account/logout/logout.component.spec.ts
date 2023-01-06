import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmEntitySpecWrapperService } from '@xm-ngx/entity';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { of } from 'rxjs';
import { LoginService } from '@xm-ngx/xm-shared';

import { LogoutComponent } from './logout.component';
import { XmPrivateUiConfigService } from '@xm-ngx/core/config';
import { SessionStorageService } from 'ngx-webstorage';

describe('LogoutComponent', () => {
    let component: LogoutComponent;
    let fixture: ComponentFixture<LogoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule, HttpClientTestingModule],
            declarations: [LogoutComponent],
            providers: [
                { provide: LoginService, useValue: {} },
                { provide: XmEntitySpecWrapperService, useValue: {} },
                { provide: TranslateService, useValue: {} },
                { provide: XmAlertService, useValue: { open: () => of({}) } },
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '' } } } },
                { provide: Router, useValue: {} },
                { provide: XmPrivateUiConfigService, useValue: {} },
                { provide: SessionStorageService, useValue: {} },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LogoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
