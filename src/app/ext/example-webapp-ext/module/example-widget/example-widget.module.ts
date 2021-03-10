import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { XmDynamicEntryModule } from '@xm-ngx/dynamic';
import { ExampleWidgetComponent } from './example-widget.component';


@NgModule({
    declarations: [ExampleWidgetComponent],
    exports: [ExampleWidgetComponent],
    imports: [
        CommonModule,
    ],
})
export class ExampleWidgetModule implements XmDynamicEntryModule<ExampleWidgetComponent> {
    /**
     * Specifying the entry point for XmDynamicModule
     */
    public entry: Type<ExampleWidgetComponent> = ExampleWidgetComponent;
}
