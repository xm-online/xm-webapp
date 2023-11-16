import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WidgetCopyDialogComponent} from './widget-copy-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {XmPrivateUiConfigService} from '@xm-ngx/core/config';
import {XmTranslationTestingModule} from '@xm-ngx/translation/testing';

describe('WidgetCopyDialogComponent', () => {
    let component: WidgetCopyDialogComponent;
    let fixture: ComponentFixture<WidgetCopyDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                WidgetCopyDialogComponent,
                XmTranslationTestingModule,
                HttpClientTestingModule
            ],
            providers: [
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: []},
                XmPrivateUiConfigService,
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(WidgetCopyDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
