import {TestBed} from '@angular/core/testing';

import {XmTableSelectionService} from './xm-table-selection.service';

describe('TableSelectionService', () => {
    let service: XmTableSelectionService<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(XmTableSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
