import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionHeaderComponent } from './selection-header.component';

describe('SelectionHeaderComponent', () => {
    let component: SelectionHeaderComponent;
    let fixture: ComponentFixture<SelectionHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectionHeaderComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(SelectionHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
