import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

type Titles = { [value: string]: Translate } | Translate[];

export interface IEnumValueOptions {
    titles?: Titles;
}

@Component({
    selector: 'xm-enum-value-view',
    template: `{{(titles[value] || value) | translate}}`,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumValueView implements IComponent<string, IEnumValueOptions> {
    @Input() public value: string;

    public titles: Titles;
    private _options: IEnumValueOptions;

    public get options(): IEnumValueOptions {
        return this._options;
    }

    @Input()
    public set options(value: IEnumValueOptions) {
        this.titles = value && value.titles ? value.titles : [];
        this._options = value;
    }
}

@NgModule({
    imports: [XmTranslationModule],
    exports: [XmEnumValueView],
    declarations: [XmEnumValueView],
    providers: [],
})
export class XmEnumValueViewModule {
    public entry: IComponentFn<string, IEnumValueOptions> = XmEnumValueView;
}
