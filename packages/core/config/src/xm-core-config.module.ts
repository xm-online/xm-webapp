import { NgModule } from '@angular/core';
import { XmPrivateUiConfigService } from './xm-private-ui-config.service';
import { XmUiConfigService } from './xm-ui-config.service';
import { CommonModule } from "@angular/common";

@NgModule({
    providers: [
        XmPrivateUiConfigService,
        XmUiConfigService,
        CommonModule
    ],
})
export class XmCoreConfigModule {
}
