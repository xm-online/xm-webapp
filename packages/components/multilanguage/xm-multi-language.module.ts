import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MultiLanguageComponent } from './xm-multi-language.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatIconModule } from '@angular/material/icon';
import { XmTranslationModule } from '@xm-ngx/translation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { HintModule } from '@xm-ngx/components/hint';
import { ControlErrorModule } from '@xm-ngx/components/control-error';

@NgModule({
    imports: [
        CommonModule,
        XmTranslationModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatIconModule,
        MatTooltipModule,
        AngularEditorModule,
        HintModule,
        ControlErrorModule,
        ReactiveFormsModule,
    ],
    exports: [MultiLanguageComponent],
    declarations: [MultiLanguageComponent],
    providers: [],
})
export class MultiLanguageModule {
    public entry: Type<MultiLanguageComponent> = MultiLanguageComponent;
}
