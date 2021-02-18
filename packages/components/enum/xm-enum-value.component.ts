import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

type Titles = { [value: string]: Translate } | Translate[];

export interface IEnumValueOptions {
    titles?: Titles;
}

@Component({
    selector: 'xm-enum-value',
    template: '{{(titles[value] || value) | translate}}',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumValue implements IComponent<string, IEnumValueOptions> {
    @Input() public value: string;

    public titles: Titles;
    private _options: IEnumValueOptions;

    public get options(): IEnumValueOptions {
        return this._options;
    }

    @Input()
    public set options(options: IEnumValueOptions) {
        this.titles = options?.titles ? options.titles : [];
        this._options = options;
    }
}

@NgModule({
    imports: [XmTranslationModule],
    exports: [XmEnumValue],
    declarations: [XmEnumValue],
})
export class XmEnumValueModule {
    public entry: IComponentFn<string, IEnumValueOptions> = XmEnumValue;
}
