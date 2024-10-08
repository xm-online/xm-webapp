import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateWrapperComponent } from './state-wrapper.component';

describe('StateWrapperComponent', () => {
    let component: StateWrapperComponent<any>;
    let fixture: ComponentFixture<StateWrapperComponent<any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StateWrapperComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(StateWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
