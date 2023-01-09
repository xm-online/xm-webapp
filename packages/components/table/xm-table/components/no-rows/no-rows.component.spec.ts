import { CDK_TABLE } from '@angular/cdk/table';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRowsComponent } from './no-rows.component';

describe('NoRowsComponent', () => {
    let component: NoRowsComponent;
    let fixture: ComponentFixture<NoRowsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [NoRowsComponent],
            providers: [
                { provide: CDK_TABLE, useValue: { setNoDataRow: () => null } },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(NoRowsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
