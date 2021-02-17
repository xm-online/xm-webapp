import { TestBed } from '@angular/core/testing';
import { StyleManagerService } from '@xm-ngx/core/theme';
import { XmApplicationConfigService } from '../../../src/app/shared/spec';

import { XmThemeStore } from './xm-theme-store.service';

describe('XmThemeStore', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            { provide: StyleManagerService, useValue: {} },
            { provide: XmApplicationConfigService, useValue: {} },
        ],
    }));

    it('should be created', () => {
        const service: XmThemeStore = TestBed.inject(XmThemeStore);
        expect(service).toBeTruthy();
    });
});
