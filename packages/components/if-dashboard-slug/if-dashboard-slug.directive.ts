import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { DashboardWrapperService } from '@xm-ngx/dashboard';
import { first } from 'rxjs/operators';

@Directive({
    selector: '[xmIfDashboardSlug]',
})
export class IfDashboardSlugDirective {

    @Input('xmIfDashboardSlug') public slug: string;
    private thenViewRef: EmbeddedViewRef<undefined> | null = null;

    constructor(
        private viewContainer: ViewContainerRef,
        private dashboardWrapperService: DashboardWrapperService,
        private thenTemplateRef: TemplateRef<undefined>,
    ) {
    }

    public ngOnChanges(): void {
        this.updateView();
    }

    public updateView(): void {
        if (!this.slug) {
            this.show();
            return;
        }

        this.dashboardWrapperService.getBySlug(this.slug)
            .pipe(first())
            .subscribe((i) => i ? this.show() : this.hide());
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
