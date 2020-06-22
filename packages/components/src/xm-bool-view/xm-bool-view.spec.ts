import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BoolViewComponent } from './xm-bool-view';

describe('BoolViewComponent', () => {
    let component: BoolViewComponent;
    let fixture: ComponentFixture<BoolViewComponent>;
    let icon: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BoolViewComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BoolViewComponent);
        component = fixture.componentInstance;
        icon = fixture.nativeElement.querySelector('mat-icon');
    });

    it('should create', () => {
        expect(component).toBeDefined();
        expect(icon.textContent).toEqual('false');
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
