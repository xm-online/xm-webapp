import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { XmDynamicConstructor, XmDynamicEntryModule } from '@xm-ngx/dynamic';
import { AngularEditorControlComponent } from './angular-editor-control.component';

@NgModule({
    declarations: [
        AngularEditorControlComponent,
    ],
    imports: [
        CommonModule,
        AngularEditorModule,
        ReactiveFormsModule,
        FormsModule,
    ],
})
export class AngularEditorControlModule implements XmDynamicEntryModule{
    public entry: XmDynamicConstructor<AngularEditorControlComponent> = AngularEditorControlComponent;
}
