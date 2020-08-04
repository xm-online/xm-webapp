import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorTextControlComponent } from './selector-text-control.component';

describe('SelectorTextControlComponent', () => {
    let component: SelectorTextControlComponent;
    let fixture: ComponentFixture<SelectorTextControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SelectorTextControlComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectorTextControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
