import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { XmTranslationModule } from '@xm-ngx/translation';
import { PasswordComponent } from './password.component';
import { Password } from './password.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PasswordPoliciesComponent } from '@xm-ngx/components/password-policies';
import { PasswordStrengthBarComponent } from '@xm-ngx/components/password-strength-bar';

@NgModule({
    exports: [PasswordComponent],
    declarations: [PasswordComponent],
    providers: [Password],
    imports: [
        FormsModule,
        MatInputModule,
        MatButtonModule,
        XmTranslationModule,
        CommonModule,
        MatCardModule,
        MatIconModule,
        PasswordPoliciesComponent,
        PasswordStrengthBarComponent,
    ],
})
export class PasswordModule {
}
