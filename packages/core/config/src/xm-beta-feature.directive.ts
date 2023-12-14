import { AfterContentInit, Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { XmUIConfig, XmUiConfigService } from "@xm-ngx/core/config";

export interface XmBetaFeatureConfig extends XmUIConfig {
    betaFeaturesEnabled: boolean;
}

/**
 * Conditionally includes an HTML element if beta features enabled
 */
@Directive({
    selector: '[xm-beta-feature]',
    standalone: true,
})
export class XmBetaFeatureDirective implements OnInit, AfterContentInit {

    private betaFeaturesEnabled: boolean = false;

    constructor(private templateRef: TemplateRef<unknown>,
                private viewContainerRef: ViewContainerRef,
                private uiConfigService: XmUiConfigService<XmBetaFeatureConfig>,
    ) {
    }

    public async ngOnInit(): Promise<void> {
        const config = await firstValueFrom(this.uiConfigService.config$());
        this.betaFeaturesEnabled = config?.betaFeaturesEnabled;
        this.updateView();
    }

    public ngAfterContentInit(): void {
        this.updateView();
    }

    private updateView(): void {
        requestAnimationFrame(() => {
            this.viewContainerRef.clear();
            if (this.betaFeaturesEnabled) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
        });
    }

}
