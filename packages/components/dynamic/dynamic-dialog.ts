import { Injectable, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DynamicComponentLoaderService, XmDynamicPresentation } from '@xm-ngx/dynamic';


@Injectable()
export class DynamicDialog {
    constructor(
        private dynamicComponents: DynamicComponentLoaderService,
        private matDialog: MatDialog,
        private viewContainerRef: ViewContainerRef,
    ) {
    }

    public async createAsync<T extends XmDynamicPresentation, R>(selector: string, value: unknown, options: unknown): Promise<MatDialogRef<T, R>> {
        const matDialogRef = await this.getDialogRef<T, R>(selector);
        matDialogRef.componentInstance.value = value;
        matDialogRef.componentInstance.options = options;
        return matDialogRef;
    }

    protected async getDialogRef<T, R>(selector: string): Promise<MatDialogRef<T, R>> {
        const cfr = await this.dynamicComponents.get(selector);
        return this.matDialog.open(cfr.component, {
            viewContainerRef: this.viewContainerRef,
            injector: cfr.injector,
        });
    }
}
