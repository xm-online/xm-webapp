import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmTableFilterInlineComponent } from './xm-table-filter-inline.component';

describe('TableFilterChipsComponent', () => {
    let component: XmTableFilterInlineComponent;
    let fixture: ComponentFixture<XmTableFilterInlineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [XmTableFilterInlineComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(XmTableFilterInlineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
