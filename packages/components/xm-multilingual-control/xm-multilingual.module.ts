import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { XmDynamicConstructor, XmDynamicEntryModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmMultilingualControlComponent } from './xm-multilingual-control.component';


@NgModule({
    declarations: [
        XmMultilingualControlComponent,
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        ReactiveFormsModule,
        XmTranslationModule,
        XmDynamicModule,
    ],
})
export class XmMultilingualModule implements XmDynamicEntryModule{
    public entry: XmDynamicConstructor<XmMultilingualControlComponent> = XmMultilingualControlComponent;
}
