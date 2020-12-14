import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateUiMngComponent } from './private-ui-mng.component';

describe('PrivateUiMngComponent', () => {
    let component: PrivateUiMngComponent;
    let fixture: ComponentFixture<PrivateUiMngComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
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
