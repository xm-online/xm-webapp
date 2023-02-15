import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[xmDigitOnly]',
})
export class DigitOnlyDirective {
    @Input() public numericType: string; // number || decimal

    private regex: any = {
        number: new RegExp(/^\d+$/),
        decimal: new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g),
    };

    private specialKeys: any = {
        number: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
        decimal: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    };

    constructor(private el: ElementRef) {
    }

    @HostListener('keydown', ['$event'])
    public onKeyDown(event: KeyboardEvent): void {

        if (this.specialKeys[this.numericType].indexOf(event.key) !== -1 || event.ctrlKey === true) {
            return;
        }
        // Do not use event.keycode this is deprecated.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        const current: string = this.el.nativeElement.value;
        const next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex[this.numericType])) {
            event.preventDefault();
        }
    }

    @HostListener('paste', ['$event'])
    public onPaste(event: ClipboardEvent): void {
        event.preventDefault();
        const pastedInput: string = event.clipboardData
            .getData('text/plain')
            .replace(/\D/g, ''); // get a digit-only string
        document.execCommand('insertText', false, pastedInput);
    }
}
