import { NgModule } from '@angular/core';
import { XmPrivateUiConfigService } from './xm-private-ui-config.service';
import { XmUiConfigService } from './xm-ui-config.service';

@NgModule({
    providers: [
        XmPrivateUiConfigService,
        XmUiConfigService,
    ],
})
export class XmCoreConfigModule {
}
