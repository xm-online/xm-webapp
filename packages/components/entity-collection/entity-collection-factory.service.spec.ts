import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EntityCollectionFactoryService } from './entity-collection-factory.service';

describe('EntityCollectionFactoryService', () => {
    let service: EntityCollectionFactoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(EntityCollectionFactoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
