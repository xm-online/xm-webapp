import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation';
import { of } from 'rxjs';
import { XmConfigService } from '../../../../../src/app/shared';

import { UaaMngComponent } from './uaa-mng.component';

describe('UaaMngComponent', () => {
    let component: UaaMngComponent;
    let fixture: ComponentFixture<UaaMngComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule],
            providers: [
                { provide: XmConfigService, useValue: { getConfig: () => of(null) } },
            ],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [UaaMngComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UaaMngComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
