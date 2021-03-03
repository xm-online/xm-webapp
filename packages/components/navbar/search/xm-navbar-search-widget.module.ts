import { NgModule } from '@angular/core';
import { XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';
import { InputModule } from '../../../../src/app/shared/directives/input.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { XmNavbarSearchWidget } from '@xm-ngx/components/navbar/search/xm-navbar-search-widget.component';

@NgModule({
    exports: [XmNavbarSearchWidget],
    declarations: [XmNavbarSearchWidget],
    imports: [
        XmTranslationModule,
        CommonModule,
        InputModule,
        MatButtonModule,
        MatInputModule,
        InputModule,
        MatIconModule
    ]
})
export class XmNavbarSearchWidgetModule {
}
