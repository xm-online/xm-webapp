import { NgModule } from '@angular/core';
import { XmPhoneNumberControlComponent } from './xm-phone-number-control.component';


@NgModule({
    exports: [XmPhoneNumberControlComponent],
    imports: [XmPhoneNumberControlComponent],
})
/** @deprecated use XmPhoneNumberControlComponent instead. */
export class XmPhoneNumberControlModule {
    public entry = XmPhoneNumberControlComponent;
}
