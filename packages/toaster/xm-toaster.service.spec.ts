import { TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { XmToasterService } from './xm-toaster.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MockUiConfigService } from '@xm-ngx/core/config/testing';
import { XmPublicUiConfigService } from '@xm-ngx/core';

describe('XmToasterService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            XmTranslationTestingModule,
            HttpClientTestingModule,
            MatSnackBarModule,
        ],
        providers:[
            { provide: XmPublicUiConfigService, useClass: MockUiConfigService },
        ]
    }));

    it('should be created', () => {
        const service: XmToasterService = TestBed.inject<XmToasterService>(XmToasterService);
        expect(service).toBeTruthy();
    });
});
