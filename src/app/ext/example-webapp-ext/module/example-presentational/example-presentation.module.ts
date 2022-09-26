import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {XmDynamicConstructor, XmDynamicPresentationEntryModule} from '@xm-ngx/dynamic';
import {ExamplePresentationalComponent} from './example-presentational.component';


@NgModule({
    declarations: [ExamplePresentationalComponent],
    exports: [ExamplePresentationalComponent],
    imports: [CommonModule],
})
export class ExamplePresentationModule implements XmDynamicPresentationEntryModule {
    /**
     * Specifying the entry point for XmDynamicModule
     */
    public entry: XmDynamicConstructor<ExamplePresentationalComponent> = ExamplePresentationalComponent;
}
