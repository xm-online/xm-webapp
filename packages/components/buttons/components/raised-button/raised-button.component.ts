import { Component } from '@angular/core';
import { ButtonBase } from '@xm-ngx/components/buttons/components/button-base';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe, NgIf } from '@angular/common';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { MatIcon } from '@angular/material/icon';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { XmPermissionModule } from '@xm-ngx/core/permission';

@Component({
    selector: 'xm-raised-button',
    standalone: true,
    imports: [MatButtonModule, MatTooltip, AsyncPipe, XmLoadingModule, MatIcon, XmTranslatePipe, XmPermissionModule, NgIf],
    templateUrl: './raised-button.component.html',
    styleUrl: './raised-button.component.scss',
    host: { class: 'xm-raised-button' },
})
export class RaisedButtonComponent extends ButtonBase {

}
