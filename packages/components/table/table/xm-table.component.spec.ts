import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { XmTableDataLoaderService } from './data/xm-table-data-loader.service';

import { XmTableComponent } from './xm-table.component';
import { XmTableFilterService } from './controllers/filters/xm-table-filter.service';

describe('XmTableComponent', () => {
    let component: XmTableComponent;
    let fixture: ComponentFixture<XmTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [XmTableComponent],
            providers: [
                { provide: XmTableFilterService, useValue: { update: () => null } },
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
