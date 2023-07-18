import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
    selector: 'xm-letters-control',
    standalone: true,
    template: `
        <input *ngFor="let i of config.mask.split('')"
               [type]="config?.type||'number'"
               #letter
               maxlength="1"
               (paste)="onPaste($event, letter)"
               (keyup)="onKeyUp($event, letter)"/>
    `,
    imports: [
        NgForOf,
    ],
    styles: [`
        :host {
            display: block;
        }

        input[type='number'] {
            -moz-appearance:textfield;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }

        input {
            width: 34px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 24px;
            margin: 0 4px;
            padding: 0 1px;
            border: none;
            border-bottom: 2px solid;
            background: none;
        }

        @media screen and (max-width: 1280px) {
            input {
                width: 33px;
                height: 40px;
                line-height: 40px;
                font-size: 19px;
            }
        }
    `],
})
export class LettersControl {
    @Input() public config: { mask: string, type?: string };
    @Output() public submitEvent: EventEmitter<string> = new EventEmitter<string>();
    @ViewChildren('letter') public components: QueryList<ElementRef<HTMLInputElement>>;


    public onKeyUp(e: KeyboardEvent, letter: HTMLInputElement): void {
        const components = this.components.toArray();
        const ix = components.findIndex((i) => i.nativeElement === letter);
        const isNumber = /^[0-9]$/i.test(e.key);
        if (isNumber) {
            letter.value = e.key;
        }
        if (ix + 1 >= components.length) {
            if (e.key === 'Backspace' && letter.value === '') {
                components[ix - 1]?.nativeElement.select();
                return;
            }
            const value = components.reduce((r, i) => r + i.nativeElement.value, '');
            this.submitEvent.next(value);
            return;
        }
        if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
            if (ix === 0) {
                return;
            }
            components[ix - 1].nativeElement.select();
            return;
        }

        if ((e.key >= '0' && e.key <= '9') || (e.key >= 'a' && e.key <= 'z') || e.key === 'ArrowRight') {
            components[ix + 1].nativeElement.select();
        }
    }

    public onPaste(e: ClipboardEvent, letter: HTMLInputElement): void {
        e.preventDefault();

        const pastedData = e.clipboardData.getData('text');
        const components = this.components.toArray();
        const startIndex = components.findIndex((i) => i.nativeElement === letter);

        Array.from(pastedData).forEach((char, index) => {
            const component = components[startIndex + index];
            if (component && /^[0-9]$/.test(char)) {
                component.nativeElement.value = char;
            }
        });

        if (startIndex + pastedData.length >= components.length) {
            const value = components.reduce((r, i) => r + i.nativeElement.value, '');
            this.submitEvent.next(value);
            return;
        }

        components[startIndex + pastedData.length]?.nativeElement.select();
    }

    public clear(): void {
        this.components.forEach(c => c.nativeElement.value = '');
    }
}
