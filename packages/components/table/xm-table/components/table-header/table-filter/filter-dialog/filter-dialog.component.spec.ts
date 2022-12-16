import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterDialogComponent} from './filter-dialog.component';

describe('FilterDialogComponent', () => {
    let component: FilterDialogComponent;
    let fixture: ComponentFixture<FilterDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FilterDialogComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FilterDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
