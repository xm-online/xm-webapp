import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { DashboardEditorService } from '@xm-ngx/administration/dashboards-config';
import { DashboardCollection, DashboardConfig } from '@xm-ngx/administration/dashboards-config/injectors';
import { XmAlertService } from '@xm-ngx/alert';
import { MockEntityCollection } from '@xm-ngx/components/entity-collection/testing/mock-entity-collection';
import { XmEventManager } from '@xm-ngx/core';
import { Principal } from '@xm-ngx/core/auth';
import { XmSharedTestingModule } from '@xm-ngx/shared';
import { XmToasterService } from '@xm-ngx/toaster';

import { DashboardEditComponent } from './dashboard-edit.component';

describe('DashboardEditComponent', () => {
    let component: DashboardEditComponent;
    let fixture: ComponentFixture<DashboardEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmSharedTestingModule, HttpClientTestingModule],
            declarations: [DashboardEditComponent],
            providers: [
                { provide: DashboardCollection, useClass: MockEntityCollection },
                { provide: DashboardEditorService, useValue: null },
                { provide: XmAlertService, useValue: null },
                { provide: DashboardConfig, useValue: null },
                { provide: XmEventManager, useValue: null },
                { provide: Principal, useValue: null },
                { provide: TranslateService, useValue: null },
                { provide: XmToasterService, useValue: null },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
