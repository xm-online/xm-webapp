import { TestBed } from '@angular/core/testing';
import { FormGroupLayoutFactoryService } from '@xm-ngx/components/form-layout';
import { XmTableFilterService } from './xm-table-filter.service';


describe('XmTableFilterService', () => {
    let service: XmTableFilterService<unknown>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: FormGroupLayoutFactoryService, useValue: null },
            ],
        });
        service = TestBed.inject(XmTableFilterService<unknown>);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
