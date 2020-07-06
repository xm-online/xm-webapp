import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { PasswordModule } from '../../../../src/app/account/password/password.module';
import { XmUserPasswordWidgetComponent } from './xm-user-password-widget.component';

@NgModule({
    declarations: [XmUserPasswordWidgetComponent],
    exports: [XmUserPasswordWidgetComponent],
    imports: [CommonModule, PasswordModule],
})
export class XmUserPasswordWidgetModule {
    public entry: Type<XmUserPasswordWidgetComponent> = XmUserPasswordWidgetComponent;
}
