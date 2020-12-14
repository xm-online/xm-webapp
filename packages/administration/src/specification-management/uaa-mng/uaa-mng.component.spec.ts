import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UaaMngComponent } from './uaa-mng.component';

describe('UaaMngComponent', () => {
    let component: UaaMngComponent;
    let fixture: ComponentFixture<UaaMngComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
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
