import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { DashboardEditorService } from './dashboard-editor.service';

describe('DashboardEditorService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [XmSharedTestingModule, HttpClientTestingModule],
        schemas: [NO_ERRORS_SCHEMA],
    }));

    it('should be created', () => {
        const service: DashboardEditorService = TestBed.get(DashboardEditorService);
        expect(service).toBeTruthy();
    });
});
