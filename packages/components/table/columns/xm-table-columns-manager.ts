import { CdkColumnDef } from '@angular/cdk/table';

export interface XmTableColumnsManager<T extends CdkColumnDef = CdkColumnDef> {
    addColumnDef(columnDef: T): void;

    removeColumnDef(columnDef: T): void;
}
