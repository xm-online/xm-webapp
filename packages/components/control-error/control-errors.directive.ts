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
 * @example
 *
 *  myControl = new FormControl(null, Validators.required);
 * <mat-error *xmControlErrors="myControl.errors; message as message">{{message}}</mat-error>
 *  // Result: <mat-error>xm-control-errors.validators.required</mat-error>
 */
@Directive({
    selector: '[xmControlErrors]',
})
export class ControlErrorsDirective implements OnChanges {

    @Input() public xmControlErrors: ValidationErrors | null;
    @Input() public xmControlErrorsTranslates: { [errorKey: string]: Translate };

    private thenTemplateRef: TemplateRef<ControlErrorsContext>;

    constructor(
        @Inject(XM_CONTROL_ERRORS_TRANSLATES) xmControlErrorsTranslates: { [errorKey: string]: Translate },
        private viewContainer: ViewContainerRef,
        private translatePipe: TranslatePipe,
        templateRef: TemplateRef<ControlErrorsContext>,
    ) {
        this.thenTemplateRef = templateRef;
        this.xmControlErrorsTranslates = xmControlErrorsTranslates;
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
