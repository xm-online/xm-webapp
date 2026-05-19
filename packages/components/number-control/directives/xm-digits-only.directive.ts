import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: 'input[xmDigitsOnly]',
    standalone: true,
})
export class DigitsOnlyDirective {
    @Input('xmDigitsOnly') public enabled = true;

    constructor(
        private readonly elementRef: ElementRef<HTMLInputElement>,
        private readonly ngControl: NgControl,
    ) {
    }

    @HostListener('beforeinput', ['$event'])
    public onBeforeInput(event: InputEvent): void {
        if (!this.enabled) {
            return;
        }

        if (event.isComposing) {
            return;
        }

        if (event.inputType.startsWith('delete')) {
            return;
        }

        const input = this.elementRef.nativeElement;
        const currentValue = input.value;
        const start = input.selectionStart ?? currentValue.length;
        const end = input.selectionEnd ?? currentValue.length;
        const insertedText = event.data ?? '';

        const nextValue =
            currentValue.slice(0, start) +
            insertedText +
            currentValue.slice(end);

        if (!/^\d*$/.test(nextValue)) {
            event.preventDefault();
        }
    }

    @HostListener('paste', ['$event'])
    public onPaste(event: ClipboardEvent): void {
        if (!this.enabled) {
            return;
        }

        const input = this.elementRef.nativeElement;
        const pastedText = event.clipboardData?.getData('text') ?? '';
        const currentValue = input.value;
        const start = input.selectionStart ?? currentValue.length;
        const end = input.selectionEnd ?? currentValue.length;

        const nextValue =
            currentValue.slice(0, start) +
            pastedText +
            currentValue.slice(end);

        if (!/^\d*$/.test(nextValue)) {
            event.preventDefault();

            const sanitizedText = pastedText.replace(/\D+/g, '');

            if (!sanitizedText) {
                return;
            }

            const sanitizedValue =
                currentValue.slice(0, start) +
                sanitizedText +
                currentValue.slice(end);

            input.value = sanitizedValue;
            this.ngControl.control?.setValue(sanitizedValue);
        }
    }

    @HostListener('input')
    public onInput(): void {
        if (!this.enabled) {
            return;
        }

        const input = this.elementRef.nativeElement;
        const rawValue = input.value;
        const sanitizedValue = rawValue.replace(/\D+/g, '');

        if (rawValue === sanitizedValue) {
            return;
        }

        input.value = sanitizedValue;
        this.ngControl.control?.setValue(sanitizedValue, {
            emitEvent: false,
        });
    }
}
