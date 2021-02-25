import { Directive, Inject, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { XM_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/control-error/xm-control-errors-translates';
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
 */
@Directive({
    selector: '[xmControlErrors]',
})
export class ControlErrorsDirective implements OnChanges {
    @Input() public xmControlErrors: ValidationErrors | null;
    private thenTemplateRef: TemplateRef<ControlErrorsContext>;

    constructor(
        @Inject(XM_CONTROL_ERRORS_TRANSLATES) xmControlErrorsTranslates: { [errorKey: string]: Translate },
        private viewContainer: ViewContainerRef,
        private translatePipe: TranslatePipe,
        templateRef: TemplateRef<ControlErrorsContext>,
    ) {
        this.thenTemplateRef = templateRef;
        this._xmControlErrorsTranslates = xmControlErrorsTranslates || {};
    }

    private _xmControlErrorsTranslates: { [errorKey: string]: Translate };

    public get xmControlErrorsTranslates(): { [p: string]: Translate } {
        return this._xmControlErrorsTranslates;
    }

    @Input()
    public set xmControlErrorsTranslates(value: { [p: string]: Translate }) {
        this._xmControlErrorsTranslates = value || {};
    }

    public ngOnChanges(): void {
        this.updateView();
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
