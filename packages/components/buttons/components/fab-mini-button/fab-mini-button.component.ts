import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { MatIcon } from '@angular/material/icon';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { ButtonBase } from '../button-base';
import { XmPermissionModule } from '@xm-ngx/core/permission';

@Component({
    selector: 'xm-fab-mini-button',
    standalone: true,
    imports: [MatButtonModule, MatTooltip, AsyncPipe, XmLoadingModule, MatIcon, XmTranslatePipe, XmPermissionModule],
    templateUrl: './fab-mini-button.component.html',
    styleUrls: ['../../styles/button-general.scss', './fab-mini-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'xm-fab-mini-button' },
})
export class FabMiniButtonComponent extends ButtonBase {

}
