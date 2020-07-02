import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { IEnumValueOptions, XmEnumValueViewModule } from '@xm-ngx/components/xm-enum-value-view';
import { XmTextViewModule } from '@xm-ngx/components/xm-text-view';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

export interface IEnumOptions extends IEnumValueOptions {
    title?: Translate;
}

@Component({
    selector: 'xm-enum-view',
    template: `
        <xm-text>
            <span xmLabel>{{options.title | translate}}</span>
            <span xmValue><xm-enum-value-view [value]="value" [options]="options"></xm-enum-value-view></span>
        </xm-text>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumView implements IComponent<string, IEnumOptions> {
    @Input() public value: string;
    @Input() public options: IEnumOptions;
}

@NgModule({
    imports: [XmTranslationModule, XmTextViewModule, XmEnumValueViewModule],
    exports: [XmEnumView],
    declarations: [XmEnumView],
    providers: [],
})
export class XmEnumViewModule {
    public entry: IComponentFn<string, IEnumOptions> = XmEnumView;
}
