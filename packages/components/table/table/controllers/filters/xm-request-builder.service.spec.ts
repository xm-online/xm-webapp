import { TestBed } from '@angular/core/testing';
import { PageService } from '@xm-ngx/dashboard';
import { of } from 'rxjs';

import { XmTableFilterController } from './xm-table-filter-controller.service';
import { PageParamsStore } from '../../params/page-params-store.service';

describe('RequestBuilderService', () => {
    let service: XmTableFilterController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                XmTableFilterController,
                { provide: PageParamsStore, useValue: { get: () => ({}) } },
                { provide: PageService, useValue: { active$: () => of(null) } },
            ],
        });
        service = TestBed.inject(XmTableFilterController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
