import { NgModule } from '@angular/core';
import { XmSharedModule } from '@xm-ngx/shared';
import { DynamicWidgetComponent } from './dynamic-widget/dynamic-widget.component';

@NgModule({
    imports: [XmSharedModule],
    exports: [DynamicWidgetComponent],
    entryComponents: [DynamicWidgetComponent],
    declarations: [DynamicWidgetComponent],
    providers: [],
})
export class XmDynamicModule {
}
