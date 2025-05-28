import { Component } from '@angular/core';

@Component({
    selector: 'xm-password-settings',
    template: `
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <xm-password></xm-password>
            </div>
        </div>
    `,
    standalone: false,
})
export class PasswordSettingsComponent {
}
