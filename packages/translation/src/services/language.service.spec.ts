import { TestBed } from '@angular/core/testing';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { XmUserService } from '@xm-ngx/core/user';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { SessionStorageService } from 'ngx-webstorage';
import { MockUiConfigService } from '@xm-ngx/core/config/testing';
import { MockUserService } from '@xm-ngx/core/user/testing';

import { LanguageService } from '@xm-ngx/translation';
import { XmLoggerService } from '@xm-ngx/logger';
import { MockXmLogger } from '@xm-ngx/logger/testing';

describe('LanguageService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [XmTranslationTestingModule],
        providers: [
            { provide: XmUiConfigService, useClass: MockUiConfigService },
            { provide: XmUserService, useClass: MockUserService },
            { provide: SessionStorageService, useValue: null },
            { provide: XmLoggerService, useClass: MockXmLogger },
        ],
    }));

    it('should be created', () => {
        const service: LanguageService = TestBed.inject<LanguageService>(LanguageService);
        expect(service).toBeTruthy();
    });
});
