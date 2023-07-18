import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmCodeModule } from '@xm-ngx/components/code';
import {
    XmLink,
    XmLinkViewComponent,
    XmLinkViewCopyComponent,
} from '@xm-ngx/components/link';
import { XmLinkExampleComponent } from './xm-link-example.component';


@NgModule({
    declarations: [XmLinkExampleComponent],
    exports: [XmLinkExampleComponent],
    imports: [
        CommonModule,
        XmLink,
        XmLinkViewComponent,
        XmLinkViewCopyComponent,
        XmCodeModule,
    ],
})
export class XmLinkExampleModule {
}
