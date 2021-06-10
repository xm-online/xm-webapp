import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMMON_TRANSLATES } from '@xm-ngx/ext/common-webapp-ext/i18n';
import { Translate } from '@xm-ngx/translation';
import { cloneDeep, defaultsDeep } from 'lodash';

export interface LoadingDialogConfig {
    title: Translate;
    buttons?: {
        decline: Translate;
        accept: Translate;
    }
}

const DEFAULT_CONFIG: LoadingDialogConfig = {
    title: '',
    buttons: {
        decline: COMMON_TRANSLATES.cancel,
        accept: COMMON_TRANSLATES.confirm,
    }
};

@Component({
    selector: 'xm-loading-dialog',
    templateUrl: './loading-dialog.component.html',
    styleUrls: ['./loading-dialog.component.scss']
})
export class LoadingDialogComponent {
    @Input() public loading: boolean;
    @Output() public onCancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() public onApply: EventEmitter<void> = new EventEmitter<void>();
    @Input()
    public set config(value: LoadingDialogConfig) {
        this._config = defaultsDeep(value, DEFAULT_CONFIG);
    }
    public get config(): LoadingDialogConfig {
        return this._config;
    }
    private _config: LoadingDialogConfig = cloneDeep(DEFAULT_CONFIG);

    public decline(): void {
        this.onCancel.emit();
    }

    public accept(): void {
        this.onApply.emit();
    }
}
