import { ApplicationRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DynamicModulesService, XM_DYNAMIC_ENTRIES, XM_DYNAMIC_EXTENSIONS } from '@xm-ngx/dynamic';

import { WidgetListService } from './widget-list.service';

describe('WidgetListService', () => {
    let service: WidgetListService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                WidgetListService,
                { provide: XM_DYNAMIC_EXTENSIONS, useValue: [] },
                { provide: XM_DYNAMIC_ENTRIES, useValue: [] },
                { provide: DynamicModulesService, useValue: null },
                { provide: Injector, useValue: null },
                { provide: ApplicationRef, useValue: null },
            ],
            imports: [],
        });
        service = TestBed.inject<WidgetListService>(WidgetListService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
