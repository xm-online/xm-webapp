import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountService, Principal } from '@xm-ngx/core/user';
import { LanguageService, TitleService } from '@xm-ngx/translation';
import { MockLanguageService, XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { MockPrincipalService } from '@xm-ngx/core/user/testing';

import { XmUserSettingsWidgetComponent } from './xm-user-settings-widget.component';
import { XmConfigService, XmUiConfigService } from '@xm-ngx/core/config';
import { MockUiConfigService, MockConfigService } from '@xm-ngx/core/config/testing';

describe('XmUserSettingsWidgetComponent', () => {
    let component: XmUserSettingsWidgetComponent;
    let fixture: ComponentFixture<XmUserSettingsWidgetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule, XmUserSettingsWidgetComponent],
            providers: [
                { provide: Principal, useClass: MockPrincipalService },
                { provide: LanguageService, useClass: MockLanguageService },
                { provide: TitleService, useValue: null },
                { provide: XmUiConfigService, useValue: MockUiConfigService },
                { provide: XmConfigService, useValue: MockConfigService },
                { provide: AccountService, useValue: null },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmUserSettingsWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
