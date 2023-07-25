import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { XmPrivateUiConfigService } from './xm-private-ui-config.service';
import { XmPermissionService } from '@xm-ngx/core/permission';
import { MockPermissionService } from '@xm-ngx/core/permission/testing';
import { XmCoreConfig } from '@xm-ngx/core';

describe('XmPrivateUiConfigService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            { provide: XmPermissionService, useClass: MockPermissionService },
            { provide: XmCoreConfig, useValue: {} },
            XmPrivateUiConfigService,
        ],
        imports: [HttpClientTestingModule],
    }));

    it('should be created', () => {
        const service: XmPrivateUiConfigService = TestBed.inject<XmPrivateUiConfigService>(XmPrivateUiConfigService);
        expect(service).toBeTruthy();
    });
});
