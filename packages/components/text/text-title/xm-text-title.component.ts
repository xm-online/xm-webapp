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
    template: '{{options.title | translate}}',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextTitleComponent implements XmDynamicPresentation<undefined, XmTextTitleOptions> {
    @Input() public value: undefined;

    private _options: XmTextTitleOptions = _.clone(XM_TEXT_TITLE_OPTIONS_DEFAULT);

    public get options(): XmTextTitleOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmTextTitleOptions) {
        this._options = _.defaults(value, XM_TEXT_TITLE_OPTIONS_DEFAULT);
    }
}
