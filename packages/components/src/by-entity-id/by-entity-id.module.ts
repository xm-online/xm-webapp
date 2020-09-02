import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ByEntityIdComponent } from '@xm-ngx/components/by-entity-id/by-entity-id.component';
import { XmTextViewModule } from '@xm-ngx/components/xm-text-view';
import { XmTranslationModule } from '@xm-ngx/translation';


@NgModule({
    declarations: [ByEntityIdComponent],
    exports: [ByEntityIdComponent],
    imports: [
        CommonModule,
        XmTranslationModule,
        XmTextViewModule,
    ],
})
export class ByEntityIdModule {
    public entry: Type<ByEntityIdComponent> = ByEntityIdComponent;
}
