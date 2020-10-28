import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardEditorService, DashboardsManagerService } from '@xm-ngx/administration/dashboards-config';
import { DashboardCollection, WidgetCollection } from '@xm-ngx/administration/dashboards-config/injectors';
import { MockEntityCollection } from '@xm-ngx/components/entity-collection/testing/mock-entity-collection';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { DashboardsListExpandComponent } from './dashboards-list-expand.component';

describe('DashboardsListExpandComponent', () => {
    let component: DashboardsListExpandComponent;
    let fixture: ComponentFixture<DashboardsListExpandComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmSharedTestingModule, HttpClientTestingModule, NoopAnimationsModule],
            declarations: [DashboardsListExpandComponent],
            providers: [
                { provide: DashboardsManagerService, useValue: null },
                { provide: DashboardEditorService, useValue: null },
                { provide: DashboardCollection, useClass: MockEntityCollection },
                { provide: WidgetCollection, useClass: MockEntityCollection },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardsListExpandComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
