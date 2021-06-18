import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMMON_TRANSLATES } from '@xm-ngx/ext/common-webapp-ext/i18n';
import { Translate } from '@xm-ngx/translation';
import { cloneDeep, defaultsDeep } from 'lodash';

export interface LoadingDialogConfig {
    /** Title to show in request window*/
    title: Translate;
    /** Translation for buttons*/
    buttons?: {
        decline: Translate;
        accept: Translate;
    }
}

export enum ActionDecision {
    CLOSE = 'CLOSE',
    APPROVE = 'APPROVE',
    DECLINE = 'DECLINE',
}

const DEFAULT_CONFIG: LoadingDialogConfig = {
    title:'',
    buttons: {
        decline: COMMON_TRANSLATES.cancel,
        accept: COMMON_TRANSLATES.confirm,
    }
};

@Component({
    selector: 'xm-confirm-action',
    templateUrl: './confirm-action.component.html',
    styleUrls: ['./confirm-action.component.scss']
})
/**
 * Reusable loading indicator with request form, should be used in material dialog window
 * @public
 */
export class ConfirmActionComponent {
    /** Use to control when loading indicator is shown*/
    @Input() public loading: boolean;
    /** Emit EMITTER_EVENTS value when button pressed*/
    @Output() public decisionEvent: EventEmitter<ActionDecision> = new EventEmitter<ActionDecision>();
    @Input()
    public set config(value: LoadingDialogConfig) {
        this._config = defaultsDeep(value, DEFAULT_CONFIG) as LoadingDialogConfig;
    }

    public get config(): LoadingDialogConfig {
        return this._config;
    }

    private _config: LoadingDialogConfig = cloneDeep(DEFAULT_CONFIG);

    public onDecline(): void {
        this.decisionEvent.emit(ActionDecision.DECLINE);
    }

    public onAccept(): void {
        this.decisionEvent.emit(ActionDecision.APPROVE);
    }

    public onClose(): void {
        this.decisionEvent.emit(ActionDecision.CLOSE);
    }
}
