import { NgModule } from '@angular/core';
import { JsfComponentRegistryService } from '@xm-ngx/json-schema-form';
import { ExampleTextComponent } from './example-text.component';

@NgModule({
    imports: [ExampleTextComponent],
    exports: [ExampleTextComponent]
})
export class ExampleWebappExtJsfModule {
    constructor(widgetService: JsfComponentRegistryService) {
        widgetService.registerWidget('example-text', ExampleTextComponent);
    }
}
