import { ChangeDetectionStrategy, Component, Input, NgModule, OnChanges, OnInit } from '@angular/core';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { XmTextComponent } from './xm-text-component';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

export interface ITextOptions {
    title?: Translate;
    style?: 'inline';
}

@Component({
    selector: 'xm-text-view',
    template: `
        <xm-text [styleInline]="styleInline">
            <span xmLabel>{{options.title | translate}}</span>
            <span xmValue>{{value}}</span>
        </xm-text>
    `,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextView implements IComponent<Primitive, ITextOptions>, OnInit, OnChanges {
    @Input() public value: Primitive;
    @Input() public options: ITextOptions;
    public styleInline: boolean;

    public ngOnInit(): void {
        this.styleInline = Boolean(this.options?.style);
    }

    public ngOnChanges(): void {
        this.styleInline = Boolean(this.options?.style);
    }
}

@NgModule({
    imports: [XmTranslationModule],
    exports: [XmTextView, XmTextComponent],
    declarations: [XmTextView, XmTextComponent],
})
export class XmTextViewModule {
    public entry: IComponentFn<Primitive, ITextOptions> = XmTextView;
}
