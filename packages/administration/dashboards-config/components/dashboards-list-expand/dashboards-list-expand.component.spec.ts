import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardEditorService, DashboardsManagerService } from '../../index';
import { DashboardCollection, WidgetCollection } from '../../injectors';
import { MockEntityCollection } from '@xm-ngx/repositories/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { DashboardsListExpandComponent } from './dashboards-list-expand.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';

describe('DashboardsListExpandComponent', () => {
    let component: DashboardsListExpandComponent;
    let fixture: ComponentFixture<DashboardsListExpandComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                XmTranslationTestingModule,
                HttpClientTestingModule,
                NoopAnimationsModule,
                MatSnackBarModule,
                MatDialogModule,
                DashboardsListExpandComponent
            ],
            declarations: [],
            providers: [
                { provide: DashboardsManagerService, useValue: { activeWidget: null } },
                { provide: DashboardEditorService, useValue: null },
                { provide: DashboardCollection, useClass: MockEntityCollection },
                { provide: WidgetCollection, useClass: MockEntityCollection },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardsListExpandComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
