import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasWithParticlesComponent } from './canvas-with-particles.component';

describe('CanvasWithParticlesComponent', () => {
    let component: CanvasWithParticlesComponent;
    let fixture: ComponentFixture<CanvasWithParticlesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CanvasWithParticlesComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CanvasWithParticlesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
