import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';
import * as _ from 'lodash';

export interface XmTextTitleOptions {
    title: Translate
}

export const XM_TEXT_TITLE_OPTIONS_DEFAULT = {
    title: '',
};

@Component({
    selector: 'xm-text-title',
    template: '{{config.title | translate}}',
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false,
})
export class XmTextTitleComponent implements XmDynamicPresentation<undefined, XmTextTitleOptions> {
    @Input() public value: undefined;

    private _config: XmTextTitleOptions = _.clone(XM_TEXT_TITLE_OPTIONS_DEFAULT);

    public get config(): XmTextTitleOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmTextTitleOptions) {
        this._config = _.defaults(value, XM_TEXT_TITLE_OPTIONS_DEFAULT);
    }
}
