import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneNumberControlComponent } from './phone-number-control.component';

describe('PhoneNumberControlComponent', () => {
    let component: PhoneNumberControlComponent;
    let fixture: ComponentFixture<PhoneNumberControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PhoneNumberControlComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PhoneNumberControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
