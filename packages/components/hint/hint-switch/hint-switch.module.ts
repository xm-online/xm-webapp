import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HintSwitchComponent } from '@xm-ngx/components/hint/hint-switch/hint-switch.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { XmTranslationModule } from '@xm-ngx/translation';

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
