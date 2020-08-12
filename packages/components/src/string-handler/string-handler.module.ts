import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringHandlerDirective } from './string-handler.directive';

@NgModule({
  exports: [StringHandlerDirective],
  declarations: [StringHandlerDirective],
  imports: [
    CommonModule
  ]
})
export class StringHandlerModule { }
