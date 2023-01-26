import { CDK_TABLE } from '@angular/cdk/table';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmTableEmptyComponent } from './xm-table-empty.component';

describe('NoRowsComponent', () => {
    let component: XmTableEmptyComponent;
    let fixture: ComponentFixture<XmTableEmptyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [XmTableEmptyComponent],
            providers: [
                { provide: CDK_TABLE, useValue: { setNoDataRow: () => null } },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(XmTableEmptyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
