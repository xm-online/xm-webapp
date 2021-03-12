import { TestBed } from '@angular/core/testing';
import { XmAlertService } from '@xm-ngx/alert';
import { PageChangesStore } from './page-changes-store';

import { PendingChangesGuard } from './pending-changes.guard';

describe('PendingChangesGuard', () => {
    let guard: PendingChangesGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PendingChangesGuard,
                { provide: PageChangesStore, useValue: {} },
                { provide: XmAlertService, useValue: {} },
            ],
        });
        guard = TestBed.inject(PendingChangesGuard);
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });
});
