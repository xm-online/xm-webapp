import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import {
    DashboardsExportService,
    DashboardsImportService,
    DashboardsManagerService,
} from '../index';
import { DashboardCollection, WidgetCollection } from '../injectors';
import { MockEntityCollection } from '@xm-ngx/repositories/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { DashboardsListComponent } from './dashboards-list.component';
import { XmToasterService } from '@xm-ngx/toaster';

describe('DashboardsListComponent', () => {
    let component: DashboardsListComponent;
    let fixture: ComponentFixture<DashboardsListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                XmTranslationTestingModule,
                HttpClientTestingModule,
                RouterTestingModule,
                CommonModule,
                MatSnackBarModule,
            ],
            declarations: [DashboardsListComponent],
            providers: [
                DatePipe,
                { provide: XmToasterService, useValue: {} },
                { provide: WidgetCollection, useClass: MockEntityCollection },
                { provide: DashboardCollection, useClass: MockEntityCollection },
                { provide: DashboardsExportService, useValue: null },
                { provide: DashboardsImportService, useValue: null },
                { provide: DashboardsManagerService, useValue: null },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});