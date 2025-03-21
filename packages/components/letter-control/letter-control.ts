import { NgStyle } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChildren,
    forwardRef,
} from '@angular/core';
import { FormArray, ReactiveFormsModule, NG_VALUE_ACCESSOR, FormControl, Validators, NG_VALIDATORS, Validator, ValidationErrors } from '@angular/forms';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { getBrowserOtp, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { NgxMaskModule } from 'ngx-mask';
import { tap } from 'rxjs';

@Component({
    selector: 'xm-letters-control',
    standalone: true,
    template: `
        <div [formGroup]="boxes">
            @for (box of boxes.controls; track $index) {
                <input
                    #letter
                    maxlength="1"
                    autocomplete="one-time-code"
                    [ngStyle]="{
                        '--input-width': config?.width,
                        '--input-height': config?.height,
                    }"
                    [mask]="mask[$index] ?? '0'"
                    [formControlName]="$index"
                    [placeholder]="config?.placeholder || ''"
                    (keyup)="handleKeyboardEvent($event, $index)"
                    (input)="handleInputEvent($event, $index)" />
            }
        </div>
    `,
    imports: [
        NgStyle,
        ReactiveFormsModule,
        NgxMaskModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LettersControl),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
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
            width: calc(var(--input-width, 34) * 1px);
            height: calc(var(--input-height, 50) * 1px);
            line-height: 50px;
            text-align: center;
            font-size: 24px;
            margin: 0 4px;
            padding: 0 1px;
            border: none;
            border-bottom: 2px solid;
            background: none;
        }

        :host(.empty-size) {
            @media screen and (max-width: 1280px) {
                input {
                    width: 33px;
                    height: 40px;
                    line-height: 40px;
                    font-size: 19px;
                }
            }
        }
    `],
})
export class LettersControl extends NgModelWrapper<string> implements OnInit, OnDestroy, AfterViewInit, Validator {
    @Input() public config: {
        mask: string,
        type?: string,
        width?: number,
        height?: number,
        placeholder?: string,
    };

    @Output() public submitEvent: EventEmitter<string> = new EventEmitter<string>();

    // An output for handling a raw boxes values, for easily generating a mask with empty values.
    @Output() public submitRawValuesEvent: EventEmitter<string[]> = new EventEmitter<string[]>();

    @ViewChildren('letter') public components: QueryList<ElementRef<HTMLInputElement>>;

    public mask: string[] = [];

    public boxes: FormArray<FormControl<string>>;

    private inputs: HTMLInputElement[];
    private indexies: Map<number, HTMLInputElement>;

    @HostBinding('class.empty-size') get emptySize(): boolean {
        return this.config?.width == null && this.config?.height == null;
    }

    @HostListener('paste', ['$event']) public handlePasteEvent(e: ClipboardEvent): void {
        e.preventDefault();

        if (!e.clipboardData) {
            return;
        }

        const text = e.clipboardData.getData('text');

        this.inputSync(text);
    }

    public handleBackspaceEvent(value: string, index: number): void {
        if (value !== '') {
            return;
        }

        this.focusPrev(index);
    }

    public handleKeyboardEvent(e: KeyboardEvent, index: number): void {
        switch (e.key) {
            case 'Backspace':
                this.handleBackspaceEvent((e.currentTarget as HTMLInputElement).value, index);
                break;
            case 'ArrowLeft':
                this.focusPrev(index);
                break;
            case 'ArrowRight':
                this.focusNext(index);
                break;
        }
    }

    public handleInputEvent(e: InputEvent, index: number): void {
        // Skip backspace input events, because we already handle it
        if (e.inputType === 'deleteContentBackward') {
            return;
        }

        const element = (e.target as HTMLInputElement);
        const value = element.value;

        if (!value) {
            this.boxes.at(index).setValue('');
            return;
        }

        if (value.length === this.mask.length) {
            this.inputSync(value);
        } else {
            this.focusNext(index);
        }
    }

    public focusPrev(index?: number): void {
        if (index == null) {
            return;
        }

        const [prevElement] = this.getSurroundInputs(index);

        if (!prevElement) {
            return;
        }

        prevElement.select();
    }

    public focusNext(index?: number): void {
        if (index == null) {
            return;
        }

        const [,currElement, nextElement] = this.getSurroundInputs(index);

        if (!nextElement) {
            // Auto select last input box to prevent type multiple chars in input
            currElement.select();
            return;
        }

        nextElement.select();
    }

    public getSurroundInputs(index?: number): [HTMLInputElement?, HTMLInputElement?, HTMLInputElement?] {
        if (index == null) {
            return [];
        }

        return [
            this.indexies.get(this.clampIndex(index - 1)),
            this.indexies.get(this.clampIndex(index)),
            this.indexies.get(this.clampIndex(index + 1)),
        ];
    }

    private clampIndex(index: number): number {
        return Math.min(Math.max(index, 0), this.inputs.length);
    }

    private toArray(text?: string): string[] {
        return Array.from(text ?? '');
    }

    private inputSync(value?: string): void {
        this.boxes.patchValue(this.toArray(value), { emitEvent: true });
    }

    public ngOnInit(): void {
        this.mask = Array.from(this.config.mask ?? '').map((v) => v === '*' ? '0' : v);
        this.boxes = new FormArray(
            this.mask.map(() => new FormControl('')),
            [
                Validators.required,
                Validators.minLength(this.mask.length),
            ],
        );

        this.boxes.valueChanges
            .pipe(
                tap((boxes: string[]) => {
                    const value = boxes.join('');

                    // Sync with parent control
                    super.change(value);
                    super.touch(value);

                    if (this.boxes.valid) {
                        // Compatibility
                        this.submitRawValuesEvent.emit(boxes);
                        this.submitEvent.emit(value);
                    }
                }),
                takeUntilOnDestroy(this),
            ).subscribe();
    }

    public ngAfterViewInit(): void {
        this.inputs = this.components.toArray().map(value => value.nativeElement);
        this.indexies = new Map(this.inputs.map((value, index) => [index, value]));

        getBrowserOtp()
            .then((otp) => {
                if (otp?.code) {
                    this.inputSync(otp.code);
                }
            })
            .catch((err) => {
                console.warn(err);
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public validate(): ValidationErrors {
        return this.boxes.errors;
    }

    public writeValue(value?: string): void {
        this.boxes.patchValue(this.toArray(value), { emitEvent: false });
    }

    public setDisabledState(isDisabled: boolean): void {
        isDisabled
            ? this.boxes.disable({ emitEvent: false })
            : this.boxes.enable({ emitEvent: false });
    }

    public clear(): void {
        this.boxes.reset(this.mask);
    }
}
