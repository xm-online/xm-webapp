import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmDynamicConstructor, XmDynamicWidgetModule } from '@xm-ngx/dynamic';
import { ExampleWidgetComponent } from './example-widget.component';


@NgModule({
    declarations: [ExampleWidgetComponent],
    exports: [ExampleWidgetComponent],
    imports: [
        CommonModule,
    ],
})
export class ExampleWidgetModule implements XmDynamicWidgetModule<ExampleWidgetComponent> {
    /**
     * Specifying the entry point for XmDynamicModule
     */
    public entry: XmDynamicConstructor<ExampleWidgetComponent> = ExampleWidgetComponent;
}
