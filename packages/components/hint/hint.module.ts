import { NgModule } from '@angular/core';
import { HintComponent } from '@xm-ngx/components/hint/hint.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';
import { HintPopoverModule } from '@xm-ngx/components/hint/hint-popover/hint-popover.module';
import { OverlayModule } from '@angular/cdk/overlay';

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
