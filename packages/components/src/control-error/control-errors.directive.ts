import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
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
    @Input() public xmControlErrorsTranslates: { [errorKey: string]: Translate } = {
        min: marker('xm-control-errors.validators.min'),
        max: marker('xm-control-errors.validators.max'),
        required: marker('xm-control-errors.validators.required'),
        email: marker('xm-control-errors.validators.email'),
        minlength: marker('xm-control-errors.validators.minlength'),
        maxlength: marker('xm-control-errors.validators.maxlength'),
        pattern: marker('xm-control-errors.validators.pattern'),
    };

    private thenTemplateRef: TemplateRef<ControlErrorsContext>;

    constructor(
        private viewContainer: ViewContainerRef,
        private translatePipe: TranslatePipe,
        templateRef: TemplateRef<ControlErrorsContext>,
    ) {
        this.thenTemplateRef = templateRef;
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
