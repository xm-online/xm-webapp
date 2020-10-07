import { Directive, EmbeddedViewRef, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { JavascriptCode } from '@xm-ngx/shared/interfaces';
import { keys, values } from 'lodash';

@Directive({
    selector: '[xmCondition]',
})
export class ConditionDirective implements OnChanges {

    @Input('xmCondition') public condition: JavascriptCode;
    @Input('xmConditionArguments') public arguments: { [key: string]: unknown };

    private thenViewRef: EmbeddedViewRef<undefined> | null = null;

    constructor(
        private viewContainer: ViewContainerRef,
        private thenTemplateRef: TemplateRef<undefined>,
    ) {
    }

    public static checkCondition(condition: string, args: { [key: string]: unknown }): boolean {
        if (!condition || !args) {
            return false;
        }

        return new Function(...keys(args), `return ${condition};`)(...values(args));
    }

    public ngOnChanges(): void {
        this.updateView();
    }

    public updateView(): void {
        if (!this.condition || !this.arguments) {
            this.show();
            return;
        }

        if (ConditionDirective.checkCondition(this.condition, this.arguments)) {
            this.show();
        } else {
            this.hide();
        }
    }

    private show(): void {
        if (!this.thenViewRef) {
            this.viewContainer.clear();
            this.thenViewRef = this.viewContainer.createEmbeddedView(this.thenTemplateRef);
        }
    }

    private hide(): void {
        this.viewContainer.clear();
        this.thenViewRef = null;
    }

}
