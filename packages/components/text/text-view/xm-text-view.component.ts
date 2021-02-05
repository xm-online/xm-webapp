import { Component, Input, NgModule } from '@angular/core';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { XmTextViewLabelComponent } from './xm-text-view-label.component';

export interface XmTextViewOptions {
    title?: Translate;
    style?: 'inline';
    emptyValue?: string;
}

export const XM_TEXT_VIEW_OPTIONS_DEFAULT: XmTextViewOptions = {
    title: null,
    style: null,
    emptyValue: ' ',
};

@Component({
    selector: 'xm-text-view',
    template: `
        <xm-text-view-label [styleInline]="!!this.options?.style">
            <span xmLabel>{{options.title | translate}}</span>
            <span xmValue>{{value || options.emptyValue}}</span>
        </xm-text-view-label>
    `,
})
export class XmTextViewComponent implements IComponent<Primitive, XmTextViewOptions> {
    @Input() public value: Primitive;

    private _options: XmTextViewOptions = XM_TEXT_VIEW_OPTIONS_DEFAULT;

    public get options(): XmTextViewOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmTextViewOptions) {
        this._options = _.defaults(value, XM_TEXT_VIEW_OPTIONS_DEFAULT);
    }
}

@NgModule({
    imports: [XmTranslationModule],
    exports: [XmTextViewComponent, XmTextViewLabelComponent],
    declarations: [XmTextViewComponent, XmTextViewLabelComponent],
})
export class XmTextViewModule {
    public entry: IComponentFn<Primitive, XmTextViewOptions> = XmTextViewComponent;
}
