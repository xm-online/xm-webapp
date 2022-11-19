import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TableFilterService} from '@xm-ngx/components/table/xm-table/service/table-filter.service';
import {FilterDialogComponent} from '@xm-ngx/components/table/xm-table/table-header/table-filter/filter-dialog/filter-dialog.component';

@Component({
    selector: 'xm-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['./table-filter.component.scss'],
})
export class TableFilterComponent implements OnInit {
    @Input() public config: any;


    constructor(private matDialog: MatDialog,
                private filterService: TableFilterService) {
    }

    ngOnInit(): void {
    }

    public openFilter() {
        const dialog = this.matDialog.open(FilterDialogComponent, {
            data: this.config,
        });
        dialog.afterClosed().subscribe((data) => {
            this.filterService.setFilters(data);
        });
    }
}
