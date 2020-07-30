import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { XmPublicUiConfigService } from '../../../packages/core/src/config/xm-public-ui-config.service';

import { XmPublicComponent } from './xm-public.component';

describe('XmPublicComponent', () => {
    let component: XmPublicComponent;
    let fixture: ComponentFixture<XmPublicComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: XmPublicUiConfigService, useValue: { config$: () => of({}) } },
                { provide: ActivatedRoute, useValue: { params: of('') } },
                { provide: Router, useValue: { navigateByUrl: r => r } },
            ],
            declarations: [XmPublicComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmPublicComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
