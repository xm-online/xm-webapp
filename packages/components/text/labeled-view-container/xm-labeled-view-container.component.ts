import { Component, Input, NgModule } from '@angular/core';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmTextViewModule } from '../text-view';

export interface XmLabeledContainerOptions {
    title?: Translate;
    labelStyle?: 'inline';
}

@Component({
    selector: 'xm-labeled-view-container',
    template: `
        <xm-text-view-container [styleInline]="this.config?.labelStyle === 'inline'">
            <span xmLabel>{{config?.title | translate}}</span>
            <span xmValue><ng-content></ng-content></span>
        </xm-text-view-container>
    `,
})
export class XmLabeledViewContainerComponent {
    @Input() public config: XmLabeledContainerOptions;
}

@NgModule({
    imports: [XmTranslationModule, XmTextViewModule],
    exports: [XmLabeledViewContainerComponent],
    declarations: [XmLabeledViewContainerComponent],
})
export class XmLabeledViewContainerModule {
}
