import {
    Directive,
    EmbeddedViewRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { JavascriptCode } from '@xm-ngx/interfaces';
import { keys, values } from 'lodash';

@Directive({
    selector: '[xmCondition]',
})
export class ConditionDirective implements OnChanges {

    @Input('xmCondition') public condition: JavascriptCode;
    @Input('xmConditionArguments') public arguments: { [key: string]: unknown };
    @Output() public conditionCheck: EventEmitter<boolean> = new EventEmitter();

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

        const jsFunction = new Function(...keys(args), `return ${condition};`);

        try {
            return jsFunction(...values(args));
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return false;
        }
    }

    public ngOnChanges(): void {
        this.updateView();
    }

    public updateView(): void {
        if (!this.condition || !this.arguments) {
            this.show();
            return;
        }

        const isShow = ConditionDirective.checkCondition(this.condition, this.arguments);
        if (isShow) {
            this.show();
        } else {
            this.hide();
        }
        this.conditionCheck.emit(isShow);
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
