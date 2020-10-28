import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardEditorService } from '@xm-ngx/administration/dashboards-config';
import {
    DashboardCollection,
    DashboardConfig,
    WidgetCollection,
} from '@xm-ngx/administration/dashboards-config/injectors';
import { XmAlertService } from '@xm-ngx/alert';
import { MockEntityCollection } from '@xm-ngx/components/entity-collection/testing/mock-entity-collection';
import { XmEventManager } from '@xm-ngx/core';
import { XmSharedTestingModule } from '@xm-ngx/shared';
import { XmToasterService } from '@xm-ngx/toaster';

import { WidgetEditComponent } from './widget-edit.component';

describe('WidgetEditComponent', () => {
    let component: WidgetEditComponent;
    let fixture: ComponentFixture<WidgetEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmSharedTestingModule, HttpClientTestingModule],
            declarations: [WidgetEditComponent],
            providers: [
                { provide: WidgetCollection, useClass: MockEntityCollection },
                { provide: DashboardCollection, useClass: MockEntityCollection },
                { provide: DashboardEditorService, useValue: null },
                { provide: DashboardConfig, useValue: null },
                { provide: XmAlertService, useValue: null },
                { provide: XmToasterService, useValue: null },
                XmEventManager
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
