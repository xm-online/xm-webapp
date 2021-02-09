import { ChangeDetectionStrategy, Component, Input, NgModule, OnChanges, OnInit } from '@angular/core';
import { XmTextViewModule } from '@xm-ngx/components/text';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmDateModule, XmDateOptions, XmDateValue } from './xm-date.component';

export interface XmDateViewOptions extends XmDateOptions {
    title?: Translate;
    textStyle?: 'inline';
}

@Component({
    selector: 'xm-date-view',
    template: `
        <xm-text-view-container [styleInline]="styleInline">
            <span xmLabel>{{options?.title | translate}}</span>
            <xm-date xmValue [value]="value" [options]="options"></xm-date>
        </xm-text-view-container>
    `,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmDateView implements IComponent<XmDateValue, XmDateViewOptions>, OnInit, OnChanges {
    @Input() public value: XmDateValue;
    @Input() public options: XmDateViewOptions;
    public styleInline: boolean;

    public ngOnInit(): void {
        this.styleInline = Boolean(this.options?.textStyle);
    }

    public ngOnChanges(): void {
        this.styleInline = Boolean(this.options?.textStyle);
    }
}

@NgModule({
    imports: [XmTranslationModule, XmDateModule, XmTextViewModule],
    exports: [XmDateView],
    declarations: [XmDateView],
})
export class XmDateViewModule {
    public entry: IComponentFn<XmDateValue, XmDateViewOptions> = XmDateView;
}
