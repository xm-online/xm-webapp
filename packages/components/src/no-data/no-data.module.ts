import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmTranslationModule } from '@xm-ngx/translation';
import { NoDataComponent } from './no-data.component';

@NgModule({
    declarations: [NoDataComponent],
    exports: [NoDataComponent],
    imports: [
        CommonModule,
        XmTranslationModule,
    ],
})
export class NoDataModule {
}
