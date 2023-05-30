import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { NgForOf } from '@angular/common';
import _ from 'lodash';

@Component({
    selector: 'xm-letters-control',
    standalone: true,
    template: `
        <input *ngFor="let i of config.mask.split('')"
               type="text"
               #letter
               maxlength="1"
               (keyup)="onKeyUp($event, letter)"/>
    `,
    imports: [
        NgForOf,
    ],
    styles: [`
        :host {
            display: block;
        }

        input {
            width: 34px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 24px;
            margin: 0 4px;
            border:none;
            border-bottom: 2px solid;
            background:none;
        }
        @media screen and (max-width: 420px) {
            input {
                width:25px;
                height: 40px;
                line-height: 40px;
                font-size: 20px;
            }
        }
    `],
})
export class LettersControl {
    @Input() public config: { mask: string };
    @Output() public submitEvent: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren('letter') public components: QueryList<ElementRef<HTMLInputElement>>;

    public onKeyUp(e: KeyboardEvent, letter: HTMLInputElement): void {
        const components = this.components.map(i => i.nativeElement);
        const ix = _.findIndex(components, (i) => i === letter);

        // When User change existing number it should replace with a new value
        const isNumber = /^[0-9]$/i.test(e.key);
        if (isNumber) {
            letter.value = e.key;
        }

        if (ix + 1 >= components.length) {
            const value = _.reduce(components, (r, i) => r + i.value, '');
            this.submitEvent.next(value);
            return;
        }

        //  backspace
        if (e.keyCode === 8 || e.keyCode === 37) {
            if (ix === 0) {
                return;
            }
            components[ix - 1].select();
            return;
        }

        if ((e.keyCode >= 48 && e.keyCode <= 57)
            || (e.keyCode >= 65 && e.keyCode <= 90)
            || (e.keyCode >= 96 && e.keyCode <= 105)
            || e.keyCode === 39) {
            components[ix + 1].select();
        }
    }

    public clear(): void {
        for (const c of this.components) {
            c.nativeElement.value = '';
        }
    }
}
