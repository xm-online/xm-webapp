import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XM_BOOL_VIEW_ICONS } from './xm-bool.injectors';
import { XmBoolComponent } from './xm-bool.component';

describe('XmBoolComponent', () => {
    let component: XmBoolComponent;
    let fixture: ComponentFixture<XmBoolComponent>;
    let icon: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [XmBoolComponent],
            providers: [{ provide: XM_BOOL_VIEW_ICONS, useValue: { true: 'true', false: 'false' } }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmBoolComponent);
        component = fixture.componentInstance;
        icon = fixture.nativeElement.querySelector('mat-icon');
    });

    it('should create', () => {
        expect(component).toBeDefined();
        expect(icon.textContent).toEqual('');
    });

    it('set value true return true', () => {
        fixture.componentInstance.value = true;
        fixture.detectChanges();
        expect(icon.textContent).toEqual('true');
    });

    it('set value "true" return true', () => {
        fixture.componentInstance.value = 'true';
        fixture.detectChanges();
        expect(icon.textContent).toEqual('true');
    });

    it('set value false return false', () => {
        fixture.componentInstance.value = false;
        fixture.detectChanges();
        expect(icon.textContent).toEqual('false');
    });

    it('set value "false" return false', () => {
        fixture.componentInstance.value = 'false';
        fixture.detectChanges();
        expect(icon.textContent).toEqual('false');
    });
});
