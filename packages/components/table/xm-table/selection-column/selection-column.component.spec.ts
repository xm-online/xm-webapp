import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionColumnComponent } from './selection-column.component';

describe('SelectionColumnComponent', () => {
    let component: SelectionColumnComponent;
    let fixture: ComponentFixture<SelectionColumnComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectionColumnComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(SelectionColumnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
