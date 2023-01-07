import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { of } from 'rxjs';
import { XmConfigService } from '@xm-ngx/core/config';

import { UiMngComponent } from './ui-mng.component';

describe('UiMngComponent', () => {
    let component: UiMngComponent;
    let fixture: ComponentFixture<UiMngComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UiMngComponent],
            providers: [
                { provide: XmConfigService, useValue: { getConfig: () => of(null) } },
            ],
            imports: [HttpClientTestingModule, XmTranslationTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UiMngComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
