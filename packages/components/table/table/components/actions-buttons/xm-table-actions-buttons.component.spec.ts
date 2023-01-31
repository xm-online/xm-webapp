import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmTableActionsButtonsComponent } from './xm-table-actions-buttons.component';
import {
    XmTableSelectionService
} from '../../controllers/selections/xm-table-selection.service';

describe('TableActionsButtonsComponent', () => {
    let component: XmTableActionsButtonsComponent;
    let fixture: ComponentFixture<XmTableActionsButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [XmTableActionsButtonsComponent],
            providers: [
                { provide: XmTableSelectionService, useValue: {} },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(XmTableActionsButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
