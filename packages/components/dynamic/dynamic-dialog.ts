import { Injectable, Injector, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { XmDynamicComponentRegistry, XmDynamicPresentation } from '@xm-ngx/dynamic';


@Injectable()
export class DynamicDialog {
    constructor(
        private dynamicComponents: XmDynamicComponentRegistry,
        private matDialog: MatDialog,
        private injector: Injector,
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
        const dialogComponent = await this.dynamicComponents.find<T>(selector, this.injector);
        return this.matDialog.open(dialogComponent.componentType,
            {
                viewContainerRef: this.viewContainerRef,
                injector: dialogComponent.injector,
                componentFactoryResolver: dialogComponent.ngModuleRef?.componentFactoryResolver,
            });
    }
}
