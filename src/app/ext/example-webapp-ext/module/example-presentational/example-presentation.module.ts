import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {XmDynamicConstructor, XmDynamicPresentationEntryModule, XmDynamicWidgetModule} from '@xm-ngx/dynamic';
import {ExamplePresentationalComponent} from './example-presentational.component';


@NgModule({
    declarations: [ExamplePresentationalComponent],
    exports: [ExamplePresentationalComponent],
    imports: [
        CommonModule,
    ],
})
export class ExamplePresentationModule implements XmDynamicPresentationEntryModuleModule<ExamplePresentationalComponent> {
    /**
     * Specifying the entry point for XmDynamicModule
     */
    public entry: XmDynamicConstructor<ExamplePresentationalComponent> = ExamplePresentationalComponent;
}
