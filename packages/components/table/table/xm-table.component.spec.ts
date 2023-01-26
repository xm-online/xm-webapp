import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XmRequestBuilderService } from '@xm-ngx/components/table/xm-table/service/xm-request-builder-service/xm-request-builder.service';
import { XmTableDataLoaderService } from '@xm-ngx/components/table/xm-table/service/xm-table-data-service/xm-table-data-loader.service';
import { of } from 'rxjs';

import { XmTableComponent } from './xm-table.component';

describe('XmTableComponent', () => {
    let component: XmTableComponent;
    let fixture: ComponentFixture<XmTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [XmTableComponent],
            providers: [
                { provide: XmRequestBuilderService, useValue: { update: () => null } },
                { provide: XmTableDataLoaderService, useValue: { getData: () => of(null), loading$: () => null } },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(XmTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
