import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {XmUiConfigService} from './ui-config/xm-ui-config.service';
import {XmSessionService} from './session/xm-session.service';

@NgModule({
    declarations: [],
    imports: [CommonModule],
})
export class CoreModule {

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [XmUiConfigService, XmSessionService],
        }
    }

}
