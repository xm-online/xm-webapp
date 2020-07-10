import { Directive, EmbeddedViewRef, Input, OnChanges, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { JavascriptCode } from '@xm-ngx/shared/interfaces/javascript-code';

@Directive({
    selector: '[xmCondition]',
})
export class ConditionDirective implements OnInit, OnChanges {

    @Input('xmCondition') public condition: JavascriptCode;
    @Input('xmConditionArguments') public arguments: unknown;

    private thenViewRef: EmbeddedViewRef<undefined> | null = null;

    constructor(
        private viewContainer: ViewContainerRef,
        private thenTemplateRef: TemplateRef<undefined>,
    ) {
    }

    public static checkCondition(condition: string, args: unknown[]): boolean {
        if (!condition || !args) {
            return false;
        }

        return (new Function('entity', `return ${condition};`))(...args);
    }

    public ngOnChanges(): void {
        this.updateView();
    }

    public ngOnInit(): void {
        this.updateView();
    }

    public updateView(): void {
        if (!this.condition || !this.arguments) {
            this.show();
            return;
        }

        const args = Array.isArray(this.arguments) ? this.arguments : [this.arguments];

        if (ConditionDirective.checkCondition(this.condition, args)) {
            this.hide();
        } else {
            this.show();
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
