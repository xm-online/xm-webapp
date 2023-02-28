import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { clone } from 'lodash';
import { MAT_FAB_DEFAULT_CONFIG, MatFabConfig } from '@xm-ngx/components/mat-fab';
import { Translate } from '@xm-ngx/translation';

export interface XmLinkButtonOptions extends MatFabConfig {
    title: Translate
}

export const XM_LINK_BUTTON_DEFAULT_OPTIONS = {
    ...MAT_FAB_DEFAULT_CONFIG,
    title: '',
};

@Component({
    selector: 'xm-link-button',
    templateUrl: './xm-link-button.component.html',
})
export class XmLinkButtonComponent {

    private _config: XmLinkButtonOptions = clone(XM_LINK_BUTTON_DEFAULT_OPTIONS);

    public get config(): XmLinkButtonOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmLinkButtonOptions) {
        this._config = _.defaults({}, value, XM_LINK_BUTTON_DEFAULT_OPTIONS);
    }
}
