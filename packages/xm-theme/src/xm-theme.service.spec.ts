import { TestBed } from '@angular/core/testing';
import { StyleManagerService } from '@xm-ngx/core/theme';
import { XmApplicationConfigService } from '../../../src/app/shared/spec';

import { XmThemeService } from './xm-theme.service';

describe('XmThemeService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            { provide: StyleManagerService, useValue: {} },
            { provide: XmApplicationConfigService, useValue: {} },
        ],
    }));

    it('should be created', () => {
        const service: XmThemeService = TestBed.get(XmThemeService);
        expect(service).toBeTruthy();
    });
});
