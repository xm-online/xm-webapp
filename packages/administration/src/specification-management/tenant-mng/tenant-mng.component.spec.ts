import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { of } from 'rxjs';
import { XmConfigService } from '../../../../../src/app/shared';

import { TenantMngComponent } from './tenant-mng.component';

describe('TenantMngComponent', () => {
    let component: TenantMngComponent;
    let fixture: ComponentFixture<TenantMngComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: XmConfigService, useValue: { getConfig: () => of(null) } },
            ],
            imports: [XmTranslationTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [TenantMngComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TenantMngComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
