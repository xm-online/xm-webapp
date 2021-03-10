import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { ImportEntitiesService } from '@xm-ngx/administration/maintenance/import-entities.service';
import { XmTranslationTestingModule } from '@xm-ngx/translation';

import { ImportEntitiesDetailsComponent } from './import-entities-details.component';

describe('ImportEntitiesDetailsComponent', () => {
    let component: ImportEntitiesDetailsComponent;
    let fixture: ComponentFixture<ImportEntitiesDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialogRef, useValue: null },
                { provide: ImportEntitiesService, useValue: null },
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [XmTranslationTestingModule],
            declarations: [ImportEntitiesDetailsComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImportEntitiesDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
