import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XmTableSelectionService } from '@xm-ngx/components/table/xm-table/service/xm-table-selection-service/xm-table-selection.service';

import { SelectionHeaderComponent } from './selection-header.component';

describe('SelectionHeaderComponent', () => {
    let component: SelectionHeaderComponent;
    let fixture: ComponentFixture<SelectionHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [SelectionHeaderComponent],
            providers: [
                { provide: XmTableSelectionService, useValue: {} },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(SelectionHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
