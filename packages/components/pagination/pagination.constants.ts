import { Injectable } from '@angular/core';

export interface IPaginationConfig {
    pageSizeOptions: number[];
    pageSize: number;
}

export const PAGINATION_CONFIG_DEFAULT: IPaginationConfig = {
    pageSizeOptions: [10, 20, 50],
    pageSize: 10,
};

@Injectable({ providedIn: 'root' })
export class PaginationConfig {
    public pageSizeOptions: number[] = PAGINATION_CONFIG_DEFAULT.pageSizeOptions;
    public pageSize: number = PAGINATION_CONFIG_DEFAULT.pageSize;
}
