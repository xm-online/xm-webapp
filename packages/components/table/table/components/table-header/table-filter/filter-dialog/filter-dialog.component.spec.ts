import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupLayoutFactoryService } from '@xm-ngx/components/form-layout';
import { CustomOverlayRef } from '@xm-ngx/components/table/xm-table/components/table-header/table-filter/overlay/custom-overlay-ref';
import { XmRequestBuilderService } from '@xm-ngx/components/table/xm-table/service/xm-request-builder-service/xm-request-builder.service';
import { of } from 'rxjs';

import { FilterDialogComponent } from './filter-dialog.component';

describe('FilterDialogComponent', () => {
    let component: FilterDialogComponent;
    let fixture: ComponentFixture<FilterDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [FilterDialogComponent],
            providers: [
                { provide: FormGroupLayoutFactoryService, useValue: null },
                { provide: XmRequestBuilderService, useValue: { change$: () => of() } },
                { provide: CustomOverlayRef, useValue: {} },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(FilterDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
