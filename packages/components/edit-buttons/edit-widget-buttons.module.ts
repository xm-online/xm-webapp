import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditWidgetButtonsComponent } from './edit-widget-buttons.component';


@NgModule({
    declarations: [EditWidgetButtonsComponent],
    exports: [EditWidgetButtonsComponent],
    imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class EditWidgetButtonsModule {
}
