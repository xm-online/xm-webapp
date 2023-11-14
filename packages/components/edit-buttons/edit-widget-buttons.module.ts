import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditWidgetButtonsComponent } from './edit-widget-buttons.component';
import { XmPermissionModule } from '@xm-ngx/core/permission';


@NgModule({
    declarations: [EditWidgetButtonsComponent],
    exports: [EditWidgetButtonsComponent],
    imports: [CommonModule, MatButtonModule, MatIconModule, XmPermissionModule],
})
export class EditWidgetButtonsModule {
    public entry: Type<EditWidgetButtonsComponent> = EditWidgetButtonsComponent;
}
