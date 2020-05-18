import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { DashboardsConfigWidgetComponent } from './dashboards-config-widget.component';

describe('DashboardsConfigComponent', () => {
    let component: DashboardsConfigWidgetComponent;
    let fixture: ComponentFixture<DashboardsConfigWidgetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmSharedTestingModule, HttpClientTestingModule],
            declarations: [DashboardsConfigWidgetComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardsConfigWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
