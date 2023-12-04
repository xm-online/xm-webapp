import { TestBed } from '@angular/core/testing';

import { DashboardsConfigHistoryService } from './dashboards-config-history.service';
import { DashboardCollection, WidgetCollection } from '../injectors';
import { MockEntityCollection } from '@xm-ngx/repositories/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { XmToasterService } from '@xm-ngx/toaster';

describe('DashboardsConfigHistoryService', () => {
    let service: DashboardsConfigHistoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DashboardsConfigHistoryService,
                { provide: DashboardCollection, useClass: MockEntityCollection },
                { provide: WidgetCollection, useClass: MockEntityCollection },
                { provide: XmToasterService, useValue: null },

            ],
            imports: [XmTranslationTestingModule, HttpClientTestingModule,
            ],
        });
        service = TestBed.inject(DashboardsConfigHistoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
