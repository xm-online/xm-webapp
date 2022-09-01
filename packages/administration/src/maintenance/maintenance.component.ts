import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import {
    ExportEntitiesDetailsComponent
} from '@xm-ngx/administration/maintenance/export-entities-details/export-entities-details.component';
import {
    ImportEntitiesDetailsComponent
} from '@xm-ngx/administration/maintenance/import-entities-details/import-entities-details.component';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';

import { XmConfigService } from '../../../../src/app/shared/spec/config.service';
import { XM_MAT_DIALOG_DEFAULT_OPTIONS } from '../../../../src/app/xm.constants';

@Component({
    selector: 'xm-maintenance',
    templateUrl: './maintenance.component.html',
    styles: [],
})
export class MaintenanceComponent {

    public isTenantCfgUpdating: boolean;

    @Input() public config: { showReindex: boolean } = {showReindex: true};

    constructor(
        private service: XmConfigService,
        private alertService: XmAlertService,
        private toasterService: XmToasterService,
        private dialog: MatDialog,
    ) {
    }

    public reindexElastic(): void {
        this.alertService.open({
            title: 'Warning. Elastic index will be re-indexed. Time consuming operation.',
            showCancelButton: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn mat-button btn-primary',
                cancelButton: 'btn mat-button',
            },
            confirmButtonText: 'Yes, reindex!',
        }).subscribe((result) => {
            if (result.value) {
                this.service.reindexTenantElastic().subscribe(
                    null,
                    null,
                    () => this.toasterService.success('global.actionPerformed'),
                );
            }
        });
    }

    public updateTenantsConfiguration(): void {
        this.alertService.open({
            title: 'Reload configuration for ALL tenants?',
            showCancelButton: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn mat-button btn-primary',
                cancelButton: 'btn mat-button',
            },
            confirmButtonText: 'Yes, reload!',
        }).subscribe((result) => {
            if (result.value) {
                this.service.updateTenantsConfig().subscribe(
                    null,
                    null,
                    () => {
                        this.toasterService.success('global.actionPerformed');
                        window.location.reload();
                    },
                );
            }
        });

    }

    public updateTenantConfiguration(): void {
        this.alertService.open({
            title: 'Reload tenant configuration?',
            showCancelButton: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn mat-button btn-primary',
                cancelButton: 'btn mat-button',
            },
            confirmButtonText: 'Yes, reload!',
        }).subscribe((result) => {
            this.isTenantCfgUpdating = true;
            if (result.value) {
                this.service.updateTenantConfig().subscribe(
                    null,
                    null,
                    () => {
                        this.isTenantCfgUpdating = false;
                        this.toasterService.success('global.actionPerformed');
                        window.location.reload();
                    });
            }
        });
    }

    public exportEntities(): void {
        const options: MatDialogConfig = {...XM_MAT_DIALOG_DEFAULT_OPTIONS, width: '960px'};
        const exportDialog = this.dialog.open(ExportEntitiesDetailsComponent, options);
        exportDialog.afterClosed().subscribe((res) => {
            if (res && res === 'success') {
                this.alertService.open({
                    title: 'xm.export-entities.message-success',
                    icon: 'success',
                    showCloseButton: false,
                    customClass: {
                        confirmButton: 'mat-flat-button mat-button-base mat-primary',
                    },
                    confirmButtonText: 'Ok',
                    width: '500px',
                }).subscribe();
            }
            if (res && res !== 'success') {
                this.alertService.open({
                    title: 'xm.export-entities.message-error',
                    icon: 'error',
                    showCloseButton: false,
                    customClass: {
                        confirmButton: 'mat-flat-button mat-button-base mat-primary',
                    },
                    confirmButtonText: 'Ok',
                    width: '500px',
                }).subscribe();
            }
        });
    }

    public importEntities(): void {
        const options: MatDialogConfig = {...XM_MAT_DIALOG_DEFAULT_OPTIONS, autoFocus: false};
        const exportDialog = this.dialog.open(ImportEntitiesDetailsComponent, options);
        exportDialog.afterClosed().subscribe((res) => {
            if (res && res === 'success') {
                this.alertService.open({
                    title: 'xm.import-entities.message-success',
                    icon: 'success',
                    showCloseButton: false,
                    customClass: {
                        confirmButton: 'mat-flat-button mat-button-base mat-primary',
                    },
                    confirmButtonText: 'Ok',
                    width: '500px',
                }).subscribe();
            }
            if (res && res !== 'success') {
                this.alertService.open({
                    title: 'xm.import-entities.message-error',
                    icon: 'error',
                    showCloseButton: false,
                    customClass: {
                        confirmButton: 'mat-flat-button mat-button-base mat-primary',
                    },
                    confirmButtonText: 'Ok',
                    width: '500px',
                }).subscribe();
            }
        });
    }

}
