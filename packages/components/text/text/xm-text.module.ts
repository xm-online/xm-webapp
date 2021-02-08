import { NgModule } from '@angular/core';
import { XmTextComponent } from './xm-text.component';
import { IComponentFn } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';

@NgModule({
  exports: [XmTextComponent],
  declarations: [XmTextComponent],
})
export class XmTextModule {
  public entry: IComponentFn<Primitive, undefined> = XmTextComponent;
}
