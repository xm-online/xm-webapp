import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    QueryList,
    ViewChildren,
    forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { getBrowserOtp } from '@xm-ngx/operators';

@Component({
    selector: 'xm-letters-control',
    standalone: true,
    template: `
        @for (i of config.mask.split(''); track $index) {
            <input
                [type]="config?.type || 'number'"
                autocomplete="one-time-code"
                #letter
                maxlength="1"
                (input)="inputOTP($event.data,letter)"
                (keyup)="onKeyUp($event, letter)"/>
        }
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LettersControl),
            multi: true,
        },
    ],
    styles: [`
        :host {
            display: block;
        }

        input[type='number'] {
            -moz-appearance: textfield;
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
export class LettersControl extends NgModelWrapper<string> implements AfterViewInit {
    @Input() public config: { mask: string, type?: string };
    @Output() public submitEvent: EventEmitter<string> = new EventEmitter<string>();
    @ViewChildren('letter') public components: QueryList<ElementRef<HTMLInputElement>>;

    @HostListener('paste', ['$event']) public handlePasteEvent(e: ClipboardEvent): void {
        e.preventDefault();

        if (!e.clipboardData) {
            return;
        }

        const text = e.clipboardData.getData('text');

        this.fillByValues(text, 0);
    }

    public ngAfterViewInit(): void {
        getBrowserOtp()
            .then((otp) => {
                if (otp?.code) {
                    this.fillByValues(otp.code, 0);
                }
            })
            .catch((err) => {
                console.warn(err);
            });
    }

    public inputOTP(data: string, letter: HTMLInputElement): void {
        const length = this.config.mask.split('').length;
        if (data?.length && data.length === length) {
            this.fillInputs(data, letter);
        }
        setTimeout(() => {
            const components = this.components.toArray();
            const testcomp = components.filter((comp) => {
                return comp.nativeElement.value.length === length;
            });
            if (testcomp.length) {
                this.fillByValues(testcomp[0].nativeElement.value, 0);
            }
        }, 100);
    }

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

    private fillInputs(data: string, letter: HTMLInputElement): void {
        const components = this.components.toArray();
        const startIndex = components.findIndex((i) => i.nativeElement === letter);
        this.fillByValues(data, startIndex);
    }

    public fillByValues(data: string, startIndex: number): void {
        const components = this.components.toArray();
        Array.from(data).forEach((char, index) => {
            const component = components[startIndex + index];
            if (component && /^[0-9]$/.test(char)) {
                component.nativeElement.value = char;
            }
        });

        if (startIndex + data.length >= components.length) {
            const value = components.reduce((r, i) => r + i.nativeElement.value, '');
            this.submitEvent.next(value);
            return;
        }

        components[startIndex + data.length]?.nativeElement.select();
    }

    public clear(): void {
        this.components.forEach(c => c.nativeElement.value = '');
    }
}
