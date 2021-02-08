import { Component, Input, NgModule } from '@angular/core';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { XmTextViewContainerComponent } from './xm-text-view-container.component';

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
        <xm-text-view-container [styleInline]="!!this.options?.style">
            <span xmLabel>{{options.title | translate}}</span>
            <span xmValue>{{value || options.emptyValue}}</span>
        </xm-text-view-container>
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
    exports: [XmTextViewComponent, XmTextViewContainerComponent],
    declarations: [XmTextViewComponent, XmTextViewContainerComponent],
})
export class XmTextViewModule {
    public entry: IComponentFn<Primitive, XmTextViewOptions> = XmTextViewComponent;
}
