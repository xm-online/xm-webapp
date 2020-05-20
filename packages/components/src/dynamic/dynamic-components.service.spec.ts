import { TestBed } from '@angular/core/testing';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { DynamicComponentsService } from './dynamic-components.service';

describe('ComponentsService', () => {
    beforeEach(() => TestBed.configureTestingModule({imports: [XmSharedTestingModule]}));

    it('should be created', () => {
        const service: DynamicComponentsService = TestBed.get(DynamicComponentsService);
        expect(service).toBeTruthy();
    });
});
