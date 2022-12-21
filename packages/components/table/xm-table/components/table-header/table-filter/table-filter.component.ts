import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from '@xm-ngx/components/table/xm-table/components/table-header/table-filter/filter-dialog/filter-dialog.component';
import { RequestBuilderService } from '@xm-ngx/components/table/xm-table/service/request-builder-service/request-builder.service';

@Component({
    selector: 'xm-table-filter',
    templateUrl: './table-filter.component.html',
})
export class TableFilterComponent {
    @Input() public config: any;
    private formValue;


    constructor(private matDialog: MatDialog,
                private requestBuilder: RequestBuilderService) {
        this.requestBuilder.change$().subscribe(value => this.formValue = value);
    }


    public openFilter(): void {
        const dialog = this.matDialog.open(FilterDialogComponent, {
            disableClose: false,
            backdropClass: [],
            data: { config: this.config, value: this.formValue },
        });
        dialog.afterClosed().subscribe((query) => {
            if (query === undefined) {
                return;
            }
            this.requestBuilder.update(query);
        });
    }


    // private removeEmpty(obj) {
    //     return Object.fromEntries(Object.entries(obj).filter(([key, v]) => v != null));
    // }
}
