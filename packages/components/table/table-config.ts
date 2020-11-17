import { Injectable } from '@angular/core';
import { IPaginationConfig, PAGINATION_CONFIG_DEFAULT } from '@xm-ngx/components/pagination';

interface ISortConfig {
    sortDirection: 'asc' | 'desc';
    sortBy: string;
}

export interface ITableConfig extends ISortConfig, IPaginationConfig {
}

export const TABLE_CONFIG_DEFAULT: ITableConfig = {
    pageSizeOptions: PAGINATION_CONFIG_DEFAULT.pageSizeOptions,
    pageSize: PAGINATION_CONFIG_DEFAULT.pageSize,
    sortDirection: 'desc',
    sortBy: 'id',
};

@Injectable({ providedIn: 'root' })
export class TableConfig implements ITableConfig {
    public sortDirection: 'asc' | 'desc' = TABLE_CONFIG_DEFAULT.sortDirection;
    public sortBy: string = TABLE_CONFIG_DEFAULT.sortBy;
    public pageSizeOptions: number[] = TABLE_CONFIG_DEFAULT.pageSizeOptions;
    public pageSize: number = TABLE_CONFIG_DEFAULT.pageSize;
}
