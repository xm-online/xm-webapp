import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExamplePresentationalComponent} from './example-presentational.component';

describe('ExamplePresentationalComponent', () => {
    let component: ExamplePresentationalComponent;
    let fixture: ComponentFixture<ExamplePresentationalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExamplePresentationalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ExamplePresentationalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
