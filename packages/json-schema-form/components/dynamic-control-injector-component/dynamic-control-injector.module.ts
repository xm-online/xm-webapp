import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { DynamicControlInjectorComponent } from './dynamic-control-injector.component';


@NgModule({
    declarations: [DynamicControlInjectorComponent],
    imports: [
        CommonModule,
        XmDynamicModule,
        ReactiveFormsModule,
    ],
    exports: [DynamicControlInjectorComponent],
})
export class DynamicControlInjectorModule {
}
