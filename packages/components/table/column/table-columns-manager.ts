import { CdkColumnDef } from '@angular/cdk/table';

export interface TableColumnsManager<T extends CdkColumnDef = CdkColumnDef> {
    addColumnDef(columnDef: T): void;

    removeColumnDef(columnDef: T): void;
}
