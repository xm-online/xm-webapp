import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ByEntityIdValueModule } from './by-entity-id-value.component';
import { ByEntityIdComponent } from './by-entity-id.component';
import { XmTextViewModule } from '@xm-ngx/components/xm-text-view';
import { XmTranslationModule } from '@xm-ngx/translation';


@NgModule({
    declarations: [ByEntityIdComponent],
    exports: [ByEntityIdComponent],
    imports: [
        CommonModule,
        ByEntityIdValueModule,
        XmTranslationModule,
        XmTextViewModule,
    ],
})
export class ByEntityIdModule {
    public entry: Type<ByEntityIdComponent> = ByEntityIdComponent;
}
