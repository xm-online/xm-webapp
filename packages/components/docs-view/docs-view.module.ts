import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { XmTextControlModule } from '@xm-ngx/components/xm-text-control';
import { DocsViewComponent } from './docs-view.component';


@NgModule({
    declarations: [DocsViewComponent],
    exports: [DocsViewComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        XmTextControlModule,
    ],
})
export class DocsViewModule {
    public entry: Type<DocsViewComponent> = DocsViewComponent;
}
