import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

type Titles = { [value: string]: Translate } | Translate[];

export interface IEnumOptions {
    title?: Translate;
    titles?: Titles;
}

@Component({
    selector: 'xm-enum-view',
    template: `
        <span class="xm-enum-view--title">{{options.title | translate}}</span>
        <span class="xm-enum-view--value">{{(titles[value] || value) | translate}}</span>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumView implements IComponent<string, IEnumOptions> {
    @Input() public value: string;

    public titles: Titles;
    private _options: IEnumOptions;

    public get options(): IEnumOptions {
        return this._options;
    }

    @Input()
    public set options(value: IEnumOptions) {
        this.titles = value && value.titles ? value.titles : [];
        this._options = value;
    }
}

@NgModule({
    imports: [XmTranslationModule],
    exports: [XmEnumView],
    declarations: [XmEnumView],
    providers: [],
})
export class XmEnumViewModule {
    public entry: IComponentFn<string, IEnumOptions> = XmEnumView;
}
