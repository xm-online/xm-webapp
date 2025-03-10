import { Directive, Inject, Input, OnChanges, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { XM_CONTROL_ERRORS_TRANSLATES, XmControlErrorsTranslates } from './xm-control-errors-translates';
import { Translate, TranslatePipe } from '@xm-ngx/translation';
import * as _ from 'lodash';

interface ControlErrorsContext<T = unknown> {
    error: T;
    message: string;
}

/**
 * Returns the matched error message with the provided error key
 * @example
 * ```
 * // Result: <mat-error>xm-control-errors.validators.required</mat-error>
 * myControl = new FormControl(null, Validators.required);
 * <mat-error *xmControlErrors="myControl.errors; message as message">{{message}}</mat-error>
 * ```
 *
 * @example
 * In case you need to pass you custom error message translation, you can use the `xmControlErrorsExtraErrorTranslations` input
 * ```html
 * <mat-error *xmControlErrors="inputControl.errors; extraErrorTranslations: extraErrorTranslations; message as message;">
 *     {{ message }}
 * </mat-error>
 * ```
 * where extraErrorTranslations:
 * ```ts
 * public extraErrorTranslations: XmControlErrorsTranslates = {
 *     unique: marker('ext.translation.key.to.the.unique.error.message'),
 * };
 * ```
 *
 */
@Directive({
    selector: '[xmControlErrors]',
})
export class ControlErrorsDirective implements OnInit, OnChanges {
    @Input() public xmControlErrors: ValidationErrors | null;
    @Input() public xmControlErrorsExtraErrorTranslations: XmControlErrorsTranslates = {};
    private thenTemplateRef: TemplateRef<ControlErrorsContext>;

    constructor(
        @Inject(XM_CONTROL_ERRORS_TRANSLATES) public globalErrorsTranslates: XmControlErrorsTranslates,
        private viewContainer: ViewContainerRef,
        private translatePipe: TranslatePipe,
        templateRef: TemplateRef<ControlErrorsContext>,
    ) {
        this.thenTemplateRef = templateRef;
        this._xmControlErrorsTranslates = globalErrorsTranslates || {};
    }

    private _xmControlErrorsTranslates: XmControlErrorsTranslates;

    public get xmControlErrorsTranslates(): { [p: string]: Translate } {
        return this._xmControlErrorsTranslates;
    }

    @Input()
    public set xmControlErrorsTranslates(value: { [p: string]: Translate }) {
        this._xmControlErrorsTranslates = {
            ...(this.globalErrorsTranslates || {}),
            ...(value || {}),
        };
    }

    public ngOnInit(): void {
        this.setExtraErrorTranslations();
    }

    public ngOnChanges(): void {
        this.updateView();
    }

    private setExtraErrorTranslations(): void {
        this._xmControlErrorsTranslates = {...this._xmControlErrorsTranslates, ...this.xmControlErrorsExtraErrorTranslations};
    }

    private getErrorMessage<T>(error: T, errorKey: string): string {
        const translate = this.getTranslateKey(errorKey);
        return this.translatePipe.transform(translate, error);
    }

    private getTranslateKey(errorKey: string): Translate {
        return this.xmControlErrorsTranslates[errorKey];
    }

    private updateView(): void {
        this.viewContainer.clear();
        _.forIn(this.xmControlErrors, (error, errorKey) => {
            const message = this.getErrorMessage(error, errorKey);
            this.viewContainer.createEmbeddedView(this.thenTemplateRef, { error, message });
        });
    }
}
