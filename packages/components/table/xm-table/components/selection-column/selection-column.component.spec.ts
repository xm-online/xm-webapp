import { CDK_TABLE } from '@angular/cdk/table';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XmTableSelectionService } from '@xm-ngx/components/table/xm-table/service/xm-table-selection-service/xm-table-selection.service';

import { SelectionColumnComponent } from './selection-column.component';

describe('SelectionColumnComponent', () => {
    let component: SelectionColumnComponent;
    let fixture: ComponentFixture<SelectionColumnComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [SelectionColumnComponent],
            providers: [
                { provide: XmTableSelectionService, useValue: {} },
                { provide: CDK_TABLE, useValue: { addColumnDef: () => null } },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(SelectionColumnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
