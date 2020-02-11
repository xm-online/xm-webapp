import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UiConfigService} from './ui-config/ui-config.service';

@NgModule({
    declarations: [],
    imports: [CommonModule],
})
export class CoreModule {

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [UiConfigService],
        }
    }

}
