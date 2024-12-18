import { inject, Injectable, Injector, Input } from '@angular/core';
import { XmDynamicInstanceService } from '@xm-ngx/dynamic';
import {
    Defaults,
} from '@xm-ngx/operators';
import { Observable, Subject } from 'rxjs';

import { saveAs } from 'file-saver';
import _ from 'lodash';

import * as XLSX from 'xlsx/xlsx.mjs';
import { dayjs } from '@xm-ngx/operators';
import {
    XmTableExportButtonControllerConfig, XmTableExportButtonControllerConfigDefault
} from './xm-table-export-button.controller.model';

import { XmTranslateService } from '@xm-ngx/translation';
import { take } from 'rxjs/operators';
import { ExportParamsButtonConfig, ExportType } from '../../components/export-button/xm-table-export-buttons.model';
import { XmTableColumn } from '../../columns/xm-table-column-dynamic-cell.component';
import { XmFilterQueryParams } from '../../collections/i-xm-table-collection-controller';

@Injectable()
export class XmTableExportButtonControllerService<T> {
    @Defaults(XmTableExportButtonControllerConfigDefault)
    public config: XmTableExportButtonControllerConfig;
    private loadingSub: Subject<boolean> = new Subject();
    @Input() private columns: XmTableColumn[];

    private xmDynamicInstanceService: XmDynamicInstanceService = inject(XmDynamicInstanceService);
    private injector: Injector = inject(Injector);

    private xmTranslateService: XmTranslateService = inject(XmTranslateService);

    private get controllerByKey(): any {
        return this.xmDynamicInstanceService.getControllerByKey(
            this.config.dataController?.key,
            this.injector
        );
    }

    public loading(): Observable<boolean> {
        return this.loadingSub.asObservable();
    }

    public export(params: XmFilterQueryParams, exportBtnConfig: ExportParamsButtonConfig): void {
        this.loadingSub.next(true);
        this.controllerByKey[this.config.dataController?.method?.get](params)
            .pipe(
                take(1),
            )
            .subscribe((items) => {
                this.downloadFile(items, exportBtnConfig);
                this.loadingSub.next(false);
            });
    }

    public downloadFile(data: Record<string, unknown>[], exportBtnConfig: ExportParamsButtonConfig): void {
        const formattedData = this.formatData(data, exportBtnConfig);

        if (exportBtnConfig.type === ExportType.XLS || exportBtnConfig.type === ExportType.XLSX) {
            this.exportToExcel(formattedData, exportBtnConfig);
        } else if (exportBtnConfig.type === ExportType.CSV) {
            this.exportToCsv(formattedData, exportBtnConfig);
        } else if (exportBtnConfig.type === ExportType.TXT) {
            this.exportToText(formattedData, exportBtnConfig);
        } else {
            console.warn(`exportType: ${exportBtnConfig.type} - not supporting`);
        }
    }

    public formatData(data: Record<string, unknown>[], exportBtnConfig: ExportParamsButtonConfig): Record<string, unknown>[] {
        const result = [];
        const filteredColumns = this.columns.concat(exportBtnConfig.additionalFields).filter(column => !(column.hideExport || !column.title));
        data.forEach((item) => {
            const obj = {};
            filteredColumns.forEach((column, i) => {
                const title = _.isObject(column.title) ? this.xmTranslateService.translate(column.title) : column.title;
                obj[title] = _.get(item, column?.field || column?.name);
            });

            result.push(obj);
        });
        return result;
    }

    protected exportToCsv(data: Record<string, unknown>[], exportBtnConfig: ExportParamsButtonConfig): void {
        const columns = this.getCsvColumns(data);
        const csvData = this.convertToCsv(data, columns);
        this.downloadCsvFile(csvData, `${exportBtnConfig.name}_${this.getCurrentDate()}.csv`, 'text/csv;charset=utf-8');
    }

    protected getCsvColumns(data: Record<string, unknown>[]): string[] {
        const columns = [];
        data.forEach(row => {
            Object.keys(row).forEach(col => {
                if (!columns.includes(col)) {
                    columns.push(col);
                }
            });
        });
        return columns;
    }

    protected convertToCsv(data: Record<string, unknown>[], columns: string[]): string {
        let csv = '';
        csv += columns.join(';') + '\n';
        data.forEach(row => {
            const values = [];
            columns.forEach(col => {
                values.push(row[col] || '');
            });
            csv += values.join(';') + '\n';
        });
        return csv;
    }

    protected downloadCsvFile(data: string, filename: string, type: string): void {
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + data], {type: type});
        saveAs(blob, filename);
    }

    protected exportToExcel(data: Record<string, unknown>[], exportBtnConfig: ExportParamsButtonConfig): void {
        const columns = this.getExcelColumns(data);
        const worksheet = XLSX.utils.json_to_sheet(data, {header: columns});
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet);
        XLSX.writeFile(workbook, `${exportBtnConfig.name}_${this.getCurrentDate()}.${exportBtnConfig.type}`);
    }

    protected getExcelColumns(data: Record<string, unknown>[]): string[] {
        const columns = [];
        data.forEach(row => {
            Object.keys(row).forEach(col => {
                if (!columns.includes(col)) {
                    columns.push(col);
                }
            });
        });
        return columns;
    }

    protected exportToText(data: Record<string, unknown>[], exportBtnConfig: ExportParamsButtonConfig): void {
        const blob = new Blob([JSON.stringify(data)], {type: 'application/octet-stream'});
        saveAs(blob, `${exportBtnConfig.name}_${this.getCurrentDate()}.txt`);
    }

    private getCurrentDate(): string {
        return dayjs(new Date()).format('YYYY-MM-DD_HH-mm');
    }
}

