import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { ExportEntitiesService } from '@xm-ngx/administration/maintenance/export-entities.service';
import { ExportSelectedEntitiesPipe } from '@xm-ngx/administration/maintenance/export-selected-entities.pipe';
import { XmTranslationTestingModule } from '@xm-ngx/translation';
import { of } from 'rxjs';
import { XmConfigService } from '../../../../../src/app/shared';

import { ExportEntitiesDetailsComponent } from './export-entities-details.component';

describe('ExportEntitiesDetailsComponent', () => {
    let component: ExportEntitiesDetailsComponent;
    let fixture: ComponentFixture<ExportEntitiesDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule],
            providers: [
                { provide: MatDialogRef, useValue: null },
                { provide: ExportEntitiesService, useValue: null },
                { provide: XmConfigService, useValue: { getConfig: () => of(null), getConfigJson: () => of(null) } },
            ],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [ExportEntitiesDetailsComponent, ExportSelectedEntitiesPipe],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportEntitiesDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
