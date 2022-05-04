import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MenuLinkComponent } from './menu-link.component';
import { MenuComponent } from './menu.component';
import { CdkTreeModule } from '@angular/cdk/tree';

@NgModule({
    imports: [
        RouterModule,
        MatIconModule,
        XmTranslationModule,
        CommonModule,
        CdkTreeModule,
        XmPermissionModule,
    ],
    exports: [MenuComponent, MenuLinkComponent],
    declarations: [MenuComponent, MenuLinkComponent],
})
export class XmMenuModule {
    public entry: Type<MenuComponent> = MenuComponent;
}
