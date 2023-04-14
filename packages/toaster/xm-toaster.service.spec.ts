import { TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { XmToasterService } from './xm-toaster.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('XmToasterService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            XmTranslationTestingModule,
            HttpClientTestingModule,
            MatSnackBarModule,
        ],
    }));

    it('should be created', () => {
        const service: XmToasterService = TestBed.inject<XmToasterService>(XmToasterService);
        expect(service).toBeTruthy();
    });
});
