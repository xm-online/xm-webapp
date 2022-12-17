import {Component, Input, ViewChild} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {FilterDialogComponent} from '@xm-ngx/components/table/xm-table/components/table-header/table-filter/filter-dialog/filter-dialog.component';
import {RequestBuilderService} from '@xm-ngx/components/table/xm-table/service/request-builder-service/request-builder.service';

@Component({
    selector: 'xm-table-filter',
    templateUrl: './table-filter.component.html',
})
export class TableFilterComponent {
    @Input() public config: any;
    private formValue: any;


    constructor(private matDialog: MatDialog,
                private requestBuilder: RequestBuilderService) {
    }

    @ViewChild(MatButton) public button: MatButton;

    public openFilter(): void {
        const dialog = this.matDialog.open(FilterDialogComponent, {
            disableClose:false,
            backdropClass: [],
            data: {config: this.config, value: this.formValue},
        });
        dialog.afterClosed().subscribe((query) => {
            this.formValue = query;

            this.requestBuilder.update(query);
        });
    }





    // private removeEmpty(obj) {
    //     return Object.fromEntries(Object.entries(obj).filter(([key, v]) => v != null));
    // }
}
