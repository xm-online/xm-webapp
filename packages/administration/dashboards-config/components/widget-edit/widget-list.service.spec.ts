import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { XmDynamicModuleRegistry, XM_DYNAMIC_ENTRIES, XM_DYNAMIC_EXTENSIONS } from '@xm-ngx/dynamic';

import { WidgetListService } from './widget-list.service';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { MockUiConfigService } from '@xm-ngx/core/config/testing';

describe('WidgetListService', () => {
    let service: WidgetListService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                WidgetListService,
                { provide: XM_DYNAMIC_EXTENSIONS, useValue: [] },
                { provide: XM_DYNAMIC_ENTRIES, useValue: [] },
                { provide: XmDynamicModuleRegistry, useValue: null },
                { provide: XmUiConfigService, useClass: MockUiConfigService },
                { provide: Injector, useValue: null },
            ],
            imports: [],
        });
        service = TestBed.inject<WidgetListService>(WidgetListService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
