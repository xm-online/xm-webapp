import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButton } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { ButtonSpinnerDirective } from '@xm-ngx/components/button-spinner/button-spinner.directive';

@Component({
    template: `
        <button [mat-button] [loading]="true"></button>
        <button [mat-button] [loading]="false"></button>
        <button [mat-button] [loading]="false" [disabled]="false"></button>
    `
})
class MockTestComponent {
}

describe('SpinnerDirective', () => {
    let fixture: ComponentFixture<MockTestComponent>;
    let buttonsWithDirective: DebugElement[];

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [MockTestComponent, MatButton, ButtonSpinnerDirective],
            schemas: [NO_ERRORS_SCHEMA],

        }).createComponent(MockTestComponent);

        fixture.detectChanges();

        buttonsWithDirective = fixture.debugElement.queryAll(By.directive(ButtonSpinnerDirective));
    });

    describe('Directive get loading=true, ', () => {
        it('should disable the button', () => {
            const button = buttonsWithDirective[0].nativeElement as HTMLButtonElement;
            expect(button.disabled).toBeTrue();
        });

        it('should add custom class to the button', () => {
            const button = buttonsWithDirective[0].nativeElement as HTMLButtonElement;
            expect(button.classList).toContain('mat-loading');
        });

        it('should create mat-progress-spinner as last child node', () => {
            const button = buttonsWithDirective[0].nativeElement as HTMLButtonElement;
            const elementName = button.children.item(button.children.length - 1).tagName.toLowerCase();
            expect(elementName).toBe('mat-progress-spinner');
        });
    });

    describe('Directive get loading = false, disable = false', () => {
        it('should disable the button', () => {
            const button = buttonsWithDirective[1].nativeElement as HTMLButtonElement;
            expect(button.disabled).toBeFalse();
        });

        it('should create an instance', () => {
            const button = buttonsWithDirective[1].nativeElement as HTMLButtonElement;
            const elementName = button.children.item(button.children.length - 1).tagName.toLowerCase();
            expect(elementName).not.toBe('mat-progress-spinner');
        });
    });

    describe('Directive get loading=false, and disabled = true', () => {
        it('should disable the button', () => {
            const button = buttonsWithDirective[2].nativeElement as HTMLButtonElement;
            expect(button.disabled).toBeFalse();
        });
    });
});
