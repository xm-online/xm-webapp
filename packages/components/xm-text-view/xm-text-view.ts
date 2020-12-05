import { Component, Input, NgModule } from '@angular/core';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { XmTextComponent } from './xm-text-component';

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
        <xm-text [styleInline]="!!this.options?.style">
            <span xmLabel>{{options.title | translate}}</span>
            <span xmValue>{{value || options.emptyValue}}</span>
        </xm-text>
    `,
})
export class XmTextView implements IComponent<Primitive, XmTextViewOptions> {
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
    exports: [XmTextView, XmTextComponent],
    declarations: [XmTextView, XmTextComponent],
})
export class XmTextViewModule {
    public entry: IComponentFn<Primitive, XmTextViewOptions> = XmTextView;
}
