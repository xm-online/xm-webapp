import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { XmArrayControlModule } from '@xm-ngx/components/array-control';
import { XmCodeContainerModule, XmCodeModule } from '@xm-ngx/components/code';
import { XmArrayControlExampleComponent } from './xm-array-control-example/xm-array-control-example.component';



@NgModule({
  declarations: [XmArrayControlExampleComponent],
  exports: [XmArrayControlExampleComponent],
    imports: [
        CommonModule,
        XmArrayControlModule,
        XmCodeModule,
        XmCodeContainerModule,
        ReactiveFormsModule,
    ],
})
export class XmArrayControlExampleModule { }
