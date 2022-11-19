import { TestBed } from '@angular/core/testing';

import { XmTableDataSourceFactoryService } from './xm-table-data-source-factory.service';

describe('XmTableDataSourceFactoryService', () => {
    let service: XmTableDataSourceFactoryService<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(XmTableDataSourceFactoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
