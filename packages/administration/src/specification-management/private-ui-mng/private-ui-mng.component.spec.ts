import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateUiMngComponent } from './private-ui-mng.component';

describe('PrivateUiMngComponent', () => {
    let component: PrivateUiMngComponent;
    let fixture: ComponentFixture<PrivateUiMngComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [HttpClientTestingModule],
            declarations: [PrivateUiMngComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PrivateUiMngComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
