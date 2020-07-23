import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { includes } from 'lodash';

@Directive({
    selector: '[xmDomain]',
})
export class DomainDirective {

    @Input('xmDomain') public domains: string | string[];

    private thenViewRef: EmbeddedViewRef<undefined> | null = null;

    constructor(
        private viewContainer: ViewContainerRef,
        private thenTemplateRef: TemplateRef<undefined>,
    ) {
    }

    public ngOnChanges(): void {
        this.updateView();
    }

    public updateView(): void {
        if (!this.domains) {
            this.show();
            return;
        }

        if (this.hasCurrentDomain()) {
            this.show();
        } else {
            this.hide();
        }
    }

    private hasCurrentDomain(): boolean {
        const domains: string[] = Array.isArray(this.domains) ? this.domains : [this.domains];
        return includes(domains, window.location.hostname);
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
