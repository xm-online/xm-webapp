import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmConfigService } from '../../../../../src/app/shared';

import { UaaLoginMngComponent } from './uaa-login-mng.component';
import { of } from 'rxjs';

describe('UaaLoginMngComponent', () => {
    let component: UaaLoginMngComponent;
    let fixture: ComponentFixture<UaaLoginMngComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [UaaLoginMngComponent],
            providers: [
                { provide: XmConfigService, useValue: { getConfig: () => of(null) } },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UaaLoginMngComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
