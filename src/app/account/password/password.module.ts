import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { XmSharedModule } from '../../shared/shared.module';
import { PasswordComponent } from './password.component';

@NgModule({
    exports: [PasswordComponent],
    declarations: [PasswordComponent],
    providers: [],
    imports: [
        FormsModule,
        MatInputModule,
        MatButtonModule,
        TranslateModule,
        CommonModule,
        XmSharedModule,
    ],
})
export class PasswordModule {
}
