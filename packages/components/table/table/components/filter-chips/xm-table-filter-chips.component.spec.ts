import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmTableFilterChipsComponent } from './xm-table-filter-chips.component';

describe('TableFilterChipsComponent', () => {
    let component: XmTableFilterChipsComponent;
    let fixture: ComponentFixture<XmTableFilterChipsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [XmTableFilterChipsComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(XmTableFilterChipsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
