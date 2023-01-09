import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFilterChipsComponent } from './table-filter-chips.component';

describe('TableFilterChipsComponent', () => {
    let component: TableFilterChipsComponent;
    let fixture: ComponentFixture<TableFilterChipsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [TableFilterChipsComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(TableFilterChipsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
