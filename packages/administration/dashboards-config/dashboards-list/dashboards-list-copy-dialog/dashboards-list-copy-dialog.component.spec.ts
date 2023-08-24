import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardsListCopyDialogComponent} from './dashboards-list-copy-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {XmTranslationTestingModule} from '@xm-ngx/translation/testing';

describe('DashboardsListCopyDialogComponent', () => {
    let component: DashboardsListCopyDialogComponent;
    let fixture: ComponentFixture<DashboardsListCopyDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DashboardsListCopyDialogComponent,
                MatDialogModule,
                XmTranslationTestingModule,
                HttpClientTestingModule
            ],
            providers: [
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: []}
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardsListCopyDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
