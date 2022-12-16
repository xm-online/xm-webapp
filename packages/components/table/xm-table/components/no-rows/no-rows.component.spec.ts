import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NoRowsComponent} from './no-rows.component';

describe('NoRowsComponent', () => {
    let component: NoRowsComponent;
    let fixture: ComponentFixture<NoRowsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NoRowsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NoRowsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
