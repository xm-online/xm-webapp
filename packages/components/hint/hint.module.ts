import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { HintComponent } from './hint.component';
import { HintPopoverModule } from './hint-popover/hint-popover.module';

@NgModule({
    imports: [
        CommonModule,
        OverlayModule,
        HintPopoverModule,
        MatFormFieldModule,
        XmTranslationModule,
    ],
    declarations: [HintComponent],
    exports: [HintComponent],
})
export class HintModule {}
