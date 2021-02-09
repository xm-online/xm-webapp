import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmCodeModule } from '@xm-ngx/components/code';
import { XmLinkModule, XmLinkViewCopyModule, XmLinkViewModule } from '@xm-ngx/components/link';
import { XmLinkExampleComponent } from './xm-link-example.component';


@NgModule({
    declarations: [XmLinkExampleComponent],
    exports: [XmLinkExampleComponent],
    imports: [
        CommonModule,
        XmLinkModule,
        XmLinkViewModule,
        XmLinkViewCopyModule,
        XmCodeModule,
    ],
})
export class XmLinkExampleModule {
}
