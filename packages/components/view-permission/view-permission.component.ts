import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmDynamicModule, XmLayout } from '@xm-ngx/dynamic';

export interface ViewPermissionConfig {
    permissions?: string | string[];
    strategy?: string;
    layouts?: XmLayout[];
}

@Component({
    standalone: true,
    selector: 'xm-view-permission',
    template: `
        <ng-template [xmPermission]="config?.permissions" [strategy]="config?.strategy">
            <xm-dynamic-presentation-layout [layouts]="config?.layouts"></xm-dynamic-presentation-layout>
        </ng-template>
    `,
    imports: [
        CommonModule,
        XmPermissionModule,
        XmDynamicModule
    ]
})
export class ViewPermissionComponent {
    @Input() public config: ViewPermissionConfig;
}