import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMMON_TRANSLATES } from '@xm-ngx/ext/common-webapp-ext/i18n';
import { Translate } from '@xm-ngx/translation';
import { cloneDeep, defaultsDeep } from 'lodash';

export interface LoadingDialogConfig {
    buttons?: {
        decline: Translate;
        accept: Translate;
    }
}

export enum EMITTER_EVENTS {
    CLOSE = 'CLOSE',
    ACCEPT = 'ACCEPT',
    DECLINE = 'DECLINE',
}

const DEFAULT_CONFIG: LoadingDialogConfig = {
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
/**
 * Reusable loading indicator with request form, should be used in material dialog window
 * @public
 */
export class LoadingDialogComponent {
    /** Use to control when loading indicator is shown*/
    @Input() public loading: boolean;
    /** Title to show in request window*/
    @Input() public title: Translate;
    /** Emit EMITTER_EVENTS value when button pressed*/
    @Output() public decisionEvent: EventEmitter<EMITTER_EVENTS> = new EventEmitter<EMITTER_EVENTS>();

    /** Translation for buttons*/
    @Input()
    public set config(value: LoadingDialogConfig) {
        this._config = defaultsDeep(value, DEFAULT_CONFIG) as LoadingDialogConfig;
    }

    public get config(): LoadingDialogConfig {
        return this._config;
    }

    private _config: LoadingDialogConfig = cloneDeep(DEFAULT_CONFIG);

    public onDecline(): void {
        this.decisionEvent.emit(EMITTER_EVENTS.DECLINE);
    }

    public onAccept(): void {
        this.decisionEvent.emit(EMITTER_EVENTS.ACCEPT);
    }

    public onClose(): void {
        this.decisionEvent.emit(EMITTER_EVENTS.CLOSE);
    }
}
