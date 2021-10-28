import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XmIfSessionDirective } from './xm-if-session.directive';
import { XmSessionService } from '@xm-ngx/core';
import { BehaviorSubject, of } from 'rxjs';
import { By } from '@angular/platform-browser';

@Component({
    template: `
        <div *xmIfSession data-qa="session-block">
            {{ content }}
        </div>
    `,
})
class HostComponent {
    public content = '';
}

describe('XmIfSessionDirective', () => {

    let fixture: ComponentFixture<HostComponent>;
    let sessionService: XmSessionService;

    function getElement() {
        return fixture.debugElement.query(By.css('div[data-qa="session-block"]'));
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [{
                provide: XmSessionService,
                useValue: {
                    isActive() {
                        return of(false);
                    },
                },
            }],
            declarations: [XmIfSessionDirective, HostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(HostComponent);
        sessionService = TestBed.inject(XmSessionService);
    });

    it('should not create an instance', () => {
        fixture.detectChanges();
        const el = getElement();
        void expect(el).toEqual(null);
    });

    it('should create an instance', () => {
        const changeStateSpy = spyOn(sessionService, 'isActive').and.returnValue(of(true));
        fixture.detectChanges();
        const el = getElement();

        expect(changeStateSpy).toHaveBeenCalled();
        expect(el).not.toBe(null);
    });

    it('should create and destroy an instance after sessionChanged', () => {
        const event = new BehaviorSubject(true);
        const changeStateSpy = spyOn(sessionService, 'isActive').and.returnValue(event);

        fixture.detectChanges();
        let el = getElement();
        expect(changeStateSpy).toHaveBeenCalled();
        expect(el).toBeInstanceOf(DebugElement);

        event.next(false);
        fixture.detectChanges();
        el = getElement();
        expect(changeStateSpy).toHaveBeenCalled();
        expect(el).toEqual(null);

        event.complete();
    });
});
