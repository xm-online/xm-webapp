import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
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
                    [type]="config?.type || 'number'"
                    [formControlName]="$index"
                    (keyup)="handleKeyboardEvent($event, $index)"
                    (input)="handleInputEvent($event, $index)" />
            }
        </div>
    `,
    imports: [
        ReactiveFormsModule,
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
export class LettersControl extends NgModelWrapper<string> implements OnInit, OnDestroy, AfterViewInit, Validator {
    @Input() public config: { mask: string, type?: string };

    @Output() public submitEvent: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren('letter') public components: QueryList<ElementRef<HTMLInputElement>>;

    private mask: string[] = [];

    public boxes: FormArray<FormControl<string>>;

    private inputs: HTMLInputElement[];
    private indexies: Map<number, HTMLInputElement>;

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

        // Some browsers like firefox, safari allow to pass chars despine input type, so erase invalid chars
        if (!/^[0-9]$/.test(value)) {
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
        this.mask = Array.from(this.config.mask ?? '').map(() => '');
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
