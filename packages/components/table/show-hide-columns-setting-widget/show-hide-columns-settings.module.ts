import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowHideColumnsSettingsComponent } from './component/show-hide-columns-settings/show-hide-columns-settings.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

@NgModule({
    declarations: [ShowHideColumnsSettingsComponent],
    exports: [ShowHideColumnsSettingsComponent],
    imports: [
        CommonModule,
        XmTranslationModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatListModule,
    ],
})
export class ShowHideColumnsSettingsModule {
    public entry: Type<ShowHideColumnsSettingsComponent> = ShowHideColumnsSettingsComponent;
}
