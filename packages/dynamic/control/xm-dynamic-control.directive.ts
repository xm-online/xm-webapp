import {
    Directive,
    EventEmitter,
    forwardRef,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { XmDynamicConstructor, XmDynamicEntryModule } from '../src/interfaces';
import { XmDynamicPresentation } from '../presentation/xm-dynamic-presentation-base.directive';
import { XmDynamicPresentationDirective } from '../presentation/xm-dynamic-presentation.directive';
import { XmDynamicComponentRegistry } from '../src/loader/xm-dynamic-component-registry.service';
import { setComponentInput } from '../operators/set-component-input';
import { from, ReplaySubject, Subject, switchMap, takeUntil, tap } from 'rxjs';

export interface XmDynamicControl<V = unknown, C = unknown> extends XmDynamicPresentation<V, C>, ControlValueAccessor {
    valueChange: EventEmitter<V>;
    disabled: boolean;
}

export interface XmDynamicControlConstructor<V = unknown, C = unknown> extends XmDynamicConstructor<XmDynamicControl<V, C>> {
    new(...args: any): XmDynamicControl<V, C>;
}

/***
 * @deprecated Will be removed in v5.0.0. Use standalone component instead.
 */
export interface XmDynamicControlEntryModule<V = unknown, C = unknown> extends XmDynamicEntryModule<XmDynamicControl<V, C>> {
    entry: XmDynamicControlConstructor<V, C>;
}


/**
 * DynamicControlComponent creates component from configs
 * @example
 * ```
 * <ng-template xmDynamicControl
 *              [selector]="'@xm-ngx/components/xm-bool-control'"
 *              [value]="false"></ng-template>
 * <ng-template xmDynamicControl
 *              [selector]="'@xm-ngx/components/xm-bool-control'"
 *              [disabled]="true"
 *              [formControl]="model"></ng-template>
 * ```
 */
@Directive({
    selector: '[xmDynamicControl]',
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => XmDynamicControlDirective), multi: true }],
})
export class XmDynamicControlDirective<V, C>
    extends XmDynamicPresentationDirective<V, C>
    implements ControlValueAccessor, XmDynamicControl<V, C>, OnInit, OnChanges, OnDestroy {
    private unsubscribe = new Subject<void>();

    private controlValue = new ReplaySubject<V>(1);

    /** Component value */
    @Input() public value: V;

    /** Component value */
    @Input() public disabled: boolean;

    /** Component options */
    @Input() public options: C;

    /** Component ref */
    @Input() public selector: XmDynamicControlConstructor<V, C> | string;

    /** Component value changes */
    @Output() public valueChange: EventEmitter<V> = new EventEmitter<V>();

    get instance(): XmDynamicControl<V, C> {
        return super.instance as XmDynamicControl<V, C>;
    }

    constructor(
        viewContainerRef: ViewContainerRef,
        injector: Injector,
        renderer: Renderer2,
        dynamicComponents: XmDynamicComponentRegistry
    ) {
        super(viewContainerRef, injector, renderer, dynamicComponents);
    }


    public ngOnInit(): void {
        from(this.createComponent()).pipe(
            /**
             * We need this because createComponent is async
             */
            switchMap(() => this.controlValue.asObservable()),
            tap(value => {
                this.updateWriteValue(value);
            }),
            takeUntil(this.unsubscribe),
        ).subscribe();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.updateValue();
        }
        if (changes.disabled) {
            this.updateDisable();
        }
        if (changes.options) {
            this.updateOptions();
        }
        if (changes.config) {
            this.updateConfig();
        }
        if (changes.selector && !changes.selector.firstChange) {
            this.createComponent().then();
        }
    }

    public ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    public registerOnChange(fn: (v: V) => void): void {
        this._onChange = fn;
        this.updateRegisterOnChange();
    }

    public registerOnTouched(fn: (v: V) => void): void {
        this._onTouched = fn;
        this.updateRegisterOnTouched();
    }

    public writeValue(obj: V): void {
        this.value = obj;
        this.controlValue.next(obj);
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.updateDisable();
    }

    protected _onChange: (v: V) => void = () => undefined;

    protected _onTouched: (v: V) => void = () => undefined;

    protected async createComponent(): Promise<void> {
        await this.createInstance();
        this.updateValue();
        this.updateRegisterOnChange();
        this.updateRegisterOnTouched();
        this.updateOptions();
        this.updateConfig();
        this.updateDisable();
    }

    protected updateDisable(): void {
        if (!this.instance || typeof this.instance.setDisabledState !== 'function') {
            return;
        }
        this.instance.setDisabledState(this.disabled);
    }

    protected updateValue(): void {
        if (!this.instance) {
            return;
        }

        setComponentInput(this.compRef, 'value', this.value);

        this.valueChange.next(this.value);
    }

    protected updateWriteValue(obj: V): void {
        if (!this.instance || typeof this.instance.writeValue !== 'function') {
            return;
        }

        this.instance.writeValue(obj);
    }

    protected updateRegisterOnChange(): void {
        if (!this.instance || typeof this.instance.registerOnChange !== 'function') {
            return;
        }
        this.instance.registerOnChange((args) => {
            this._onChange(args);
            this.valueChange.next(args);
        });
    }

    protected updateRegisterOnTouched(): void {
        if (!this.instance || typeof this.instance.registerOnTouched !== 'function') {
            return;
        }
        this.instance.registerOnTouched((args) => this._onTouched(args));
    }

}
