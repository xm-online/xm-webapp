import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { ConditionDashboardDialogComponent } from './condition-dashboard-dialog.component';
import { MockDashboardStore } from '@xm-ngx/core/dashboard/testing';

describe('ConditionDashboardDialogComponent', () => {
    let component: ConditionDashboardDialogComponent;
    let fixture: ComponentFixture<ConditionDashboardDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [XmTranslationTestingModule],
            declarations: [ConditionDashboardDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: DashboardStore, useClass: MockDashboardStore },
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConditionDashboardDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
