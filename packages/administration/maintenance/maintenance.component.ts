import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import {
    ExportEntitiesDetailsComponent
} from './export-entities-details/export-entities-details.component';
import {
    ImportEntitiesDetailsComponent
} from './import-entities-details/import-entities-details.component';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';

import { XmConfigService } from '@xm-ngx/core/config';

/** Default settings for mat-dialogs */
export const XM_MAT_DIALOG_DEFAULT_OPTIONS: MatDialogConfig = {
    role: 'dialog',
    panelClass: 'xm-mat-dialog',
    hasBackdrop: true,
    backdropClass: '',
    disableClose: true,
    minWidth: '120px',
    minHeight: '50px',
    width: '680px',
    maxWidth: '80vw',
    data: null,
    direction: 'ltr',
    ariaDescribedBy: null,
    ariaLabel: null,
    autoFocus: true,
};

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
                    confirmButtonText: 'Ok',
                    width: '500px',
                }).subscribe();
            }
            if (res && res !== 'success') {
                this.alertService.open({
                    title: 'xm.export-entities.message-error',
                    icon: 'error',
                    showCloseButton: false,
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
                    confirmButtonText: 'Ok',
                    width: '500px',
                }).subscribe();
            }
            if (res && res !== 'success') {
                this.alertService.open({
                    title: 'xm.import-entities.message-error',
                    icon: 'error',
                    showCloseButton: false,
                    confirmButtonText: 'Ok',
                    width: '500px',
                }).subscribe();
            }
        });
    }

}
