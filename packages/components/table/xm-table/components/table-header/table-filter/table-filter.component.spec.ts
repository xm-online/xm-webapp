import { Overlay } from '@angular/cdk/overlay';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayService } from '@xm-ngx/components/table/xm-table/components/table-header/table-filter/overlay/overlay.service';

import { TableFilterComponent } from './table-filter.component';

describe('TableFilterComponent', () => {
    let component: TableFilterComponent;
    let fixture: ComponentFixture<TableFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [TableFilterComponent],
            providers: [
                { provide: Overlay, useValue: null },
                { provide: OverlayService, useValue: null },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(TableFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
