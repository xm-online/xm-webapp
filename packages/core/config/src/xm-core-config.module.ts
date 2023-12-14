import { NgModule } from '@angular/core';
import { XmPrivateUiConfigService } from './xm-private-ui-config.service';
import { XmUiConfigService } from './xm-ui-config.service';
import { XmBetaFeatureDirective } from "./xm-beta-feature.directive";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [XmBetaFeatureDirective],
    exports: [XmBetaFeatureDirective],
    providers: [
        XmPrivateUiConfigService,
        XmUiConfigService,
        CommonModule
    ],
})
export class XmCoreConfigModule {
}
