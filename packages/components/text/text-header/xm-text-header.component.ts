import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { clone, defaults } from 'lodash';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

export interface XmTextHeaderOptions {
    title: Translate,
    layout: {
        theme: {
            style: string,
            class: string,
        },
    },

}

export const XM_TEXT_HEADER_OPTIONS_DEFAULT = {
    title: '',
    layout: {
        theme: {
            style: '',
            class: '',
        },
    },
};

@Component({
    selector: 'xm-text-header',
    template: `
        <h5 class="text-header"
            [style]="config?.layout?.theme?.style"
            [class]="config?.layout?.theme?.class">
            {{ (value || config.title)| translate }}
        </h5>
    `,
    styleUrl: './xm-text-header.component.scss',
    imports: [XmTranslationModule],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextHeaderComponent implements XmDynamicPresentation<undefined, XmTextHeaderOptions> {
    @Input() public value: undefined;

    private _config: XmTextHeaderOptions = clone(XM_TEXT_HEADER_OPTIONS_DEFAULT);

    public get config(): XmTextHeaderOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmTextHeaderOptions) {
        this._config = defaults(value, XM_TEXT_HEADER_OPTIONS_DEFAULT);
    }
}
