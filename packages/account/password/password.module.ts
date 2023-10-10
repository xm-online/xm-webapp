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
import { PasswordStrengthBarComponent } from '@xm-ngx/components/password-strength-bar';
import { PasswordPoliciesComponent } from '@xm-ngx/components/password-policies/password-policies.component';

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
        PasswordStrengthBarComponent,
        PasswordPoliciesComponent,
    ],
})
export class PasswordModule {
}
