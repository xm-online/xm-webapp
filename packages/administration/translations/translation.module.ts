import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { XmTranslationModule } from '@xm-ngx/translation';
import { KeysViewComponent } from './keys-view/keys-view.component';
import { TranslationComponent } from './translation.component';
import { TranslationService } from './services/translation.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslationAddComponent } from '@xm-ngx/administration/translations/translation-add/translation-add.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    imports: [
        MatButtonModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        ScrollingModule,
        XmTranslationModule,
        CommonModule,
        TranslationAddComponent,
        MatSlideToggleModule,
    ],
    exports: [TranslationComponent],
    declarations: [TranslationComponent, KeysViewComponent],
    providers: [TranslationService],
})
export class TranslationModule {
    public entry: Type<TranslationComponent> = TranslationComponent;
}
