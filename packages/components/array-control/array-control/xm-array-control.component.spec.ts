import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { XmTranslationTestingModule } from '@xm-ngx/translation';

import { XmArrayControlComponent } from './xm-array-control.component';

describe('XmArrayControlComponent', () => {
    let component: XmArrayControlComponent;
    let fixture: ComponentFixture<XmArrayControlComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                XmTranslationTestingModule,
                MatAutocompleteModule,
            ],
            declarations: [XmArrayControlComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(XmArrayControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
