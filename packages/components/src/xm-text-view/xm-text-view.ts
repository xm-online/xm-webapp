import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    NgModule,
    OnChanges,
    OnInit,
} from '@angular/core';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

export interface ITextOptions {
    title?: Translate;
    style?: 'inline';
}

@Component({
    selector: 'xm-text-view',
    template: `
        <label class="xm-text-view--label">{{options.title | translate}}</label>
        <p class="xm-text-view--value">{{value}}</p>
    `,
    styleUrls: ['./xm-text-view.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextView implements IComponent<string, ITextOptions>, OnInit, OnChanges {
    @Input() public value: string;
    @Input() public options: ITextOptions;
    @HostBinding('class.inline') public styleInline: boolean;

    public ngOnInit(): void {
        this.styleInline = Boolean(this.options?.style);
    }

    public ngOnChanges(): void {
        this.styleInline = Boolean(this.options?.style);
    }
}

@NgModule({
    imports: [XmTranslationModule],
    exports: [XmTextView],
    declarations: [XmTextView],
})
export class XmTextViewModule {
    public entry: IComponentFn<string, ITextOptions> = XmTextView;
}
