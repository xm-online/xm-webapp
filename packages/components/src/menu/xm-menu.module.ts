import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MenuLinkComponent } from './menu-link.component';
import { MenuComponent } from './menu.component';

@NgModule({
    imports: [
        RouterModule,
        MatIconModule,
        XmTranslationModule,
        CommonModule,
    ],
    exports: [MenuComponent, MenuLinkComponent],
    declarations: [MenuComponent, MenuLinkComponent],
})
export class XmMenuModule {
}
