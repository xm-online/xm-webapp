import { Injectable } from '@angular/core';
import { XmTranslateService } from '@xm-ngx/translation';
import { XmAlertConfig } from './xm-alert.interface';
import { defaultsDeep } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class XmAlertConfigService {
    private defaults: XmAlertConfig;

    constructor(private translateService: XmTranslateService) {
        this.defaults = {
            width: 640,
            dialogActionsAlign: 'end',
            noLabel: this.translateService.translate('global.common.no'),
            yesLabel: this.translateService.translate('global.common.yes'),
            cancelLabel: this.translateService.translate('global.common.cancel'),
            deleteMessage: this.translateService.translate('global.common.delete-message'),
            deleteLabel: this.translateService.translate('global.common.delete'),
        };
    }

    public getWithDefaults(settings: {}): any {
        return defaultsDeep({}, this.defaults, settings);
    }
}

