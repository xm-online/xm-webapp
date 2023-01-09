import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { XmRequestBuilderService } from '@xm-ngx/components/table/xm-table/service/xm-request-builder-service/xm-request-builder.service';
import { XmTableSelectionService } from '@xm-ngx/components/table/xm-table/service/xm-table-selection-service/xm-table-selection.service';

import { XmDynamicTableComponent } from './xm-dynamic-table.component';

describe('XmDynamicTableComponent', () => {
    let component: XmDynamicTableComponent<unknown>;
    let fixture: ComponentFixture<XmDynamicTableComponent<unknown>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [XmDynamicTableComponent, MatSort, MatPaginator],
            providers: [
                { provide: XmRequestBuilderService, useValue: { update: () => null } },
                { provide: XmTableSelectionService, useValue: {} },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(XmDynamicTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
