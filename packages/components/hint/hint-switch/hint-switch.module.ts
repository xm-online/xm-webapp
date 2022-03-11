import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HintSwitchComponent } from './hint-switch.component';

@NgModule({
    declarations: [
        HintSwitchComponent,
    ],
    exports: [ HintSwitchComponent ],
    imports: [
        CommonModule,
        MatSlideToggleModule,
        XmTranslationModule,
    ],
})
export class HintSwitchModule {
    public entry: Type<HintSwitchComponent> = HintSwitchComponent;
}
