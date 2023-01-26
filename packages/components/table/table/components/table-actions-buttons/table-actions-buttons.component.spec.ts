import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableActionsButtonsComponent } from './table-actions-buttons.component';
import {
    XmTableSelectionService
} from '../../controllers/selections/xm-table-selection.service';

describe('TableActionsButtonsComponent', () => {
    let component: TableActionsButtonsComponent;
    let fixture: ComponentFixture<TableActionsButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [TableActionsButtonsComponent],
            providers: [
                { provide: XmTableSelectionService, useValue: {} },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(TableActionsButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
