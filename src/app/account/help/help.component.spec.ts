import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { JhiLanguageService } from 'ng-jhipster';
import { of } from 'rxjs';
import { XmConfigService } from '../../shared';

import { HelpComponent } from './help.component';

describe('HelpComponent', () => {
    let component: HelpComponent;
    let fixture: ComponentFixture<HelpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule],
            declarations: [HelpComponent],
            providers: [
                { provide: XmConfigService, useValue: { getUiConfig: () => of(null) } },
                { provide: JhiLanguageService, useValue: { getCurrent: () => Promise.resolve() } },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HelpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
