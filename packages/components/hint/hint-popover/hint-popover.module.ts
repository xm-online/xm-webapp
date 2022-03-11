import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HintPopoverComponent } from './hint-popover.component';

@NgModule({
    declarations: [ HintPopoverComponent ],
    exports: [ HintPopoverComponent ],
    imports: [ CommonModule, XmTranslationModule, MatButtonModule, MatIconModule, OverlayModule, PortalModule ],
})
export class HintPopoverModule {
}
