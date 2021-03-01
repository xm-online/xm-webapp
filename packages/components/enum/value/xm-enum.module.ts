import { NgModule } from '@angular/core';
import { XmEnumComponent, XmEnumOptions } from './xm-enum.component';
import { IComponentFn } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';

@NgModule({
  imports: [XmTranslationModule],
  exports: [XmEnumComponent],
  declarations: [XmEnumComponent],
})
export class XmEnumModule {
  public entry: IComponentFn<string, XmEnumOptions> = XmEnumComponent;
}
