import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ExportEntitiesService } from './export-entities.service';

describe('ExportEntitiesService', () => {
    let service: ExportEntitiesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(ExportEntitiesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
