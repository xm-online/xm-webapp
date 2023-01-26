import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XmTableSelectionService } from '../../controllers/selections/xm-table-selection.service';

import { XmTableSelectionHeaderComponent } from './xm-table-selection-header.component';

describe('SelectionHeaderComponent', () => {
    let component: XmTableSelectionHeaderComponent;
    let fixture: ComponentFixture<XmTableSelectionHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [XmTableSelectionHeaderComponent],
            providers: [
                { provide: XmTableSelectionService, useValue: {} },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(XmTableSelectionHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
