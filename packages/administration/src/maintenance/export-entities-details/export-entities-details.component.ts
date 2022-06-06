import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { ExportEntitiesService } from '@xm-ngx/administration/maintenance/export-entities.service';
import { XmEntitySpec, XmEntitySpecService} from '@xm-ngx/entity';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

import * as _ from 'lodash';
import { finalize, map } from 'rxjs/operators';
import { saveFile } from '../../../../../src/app/shared/helpers/file-download-helper';

export interface ExportConfig extends XmEntitySpec {
    selected?: boolean;
    selection?: ExportConfig[];
    treeModel?: unknown;
    events?: unknown[];
}

@Component({
    selector: 'xm-export-entities-details',
    templateUrl: './export-entities-details.component.html',
    styleUrls: ['./export-entities-details.component.scss'],
})
export class ExportEntitiesDetailsComponent implements OnInit, OnDestroy {

    public showLoader: boolean = true;
    public config: ExportConfig[];
    public selectedSpecs: string[];
    public currentSpecKey: string;

    constructor(
        private exportEntitiesService: ExportEntitiesService,
        private activeModal: MatDialogRef<ExportEntitiesDetailsComponent>,
        private specService: XmEntitySpecService,
    ) {
    }

    public ngOnInit(): void {
        this.specService.getAll().pipe(
            map(
                cfg => cfg.map(t => {
                    return Object.assign(t, {
                        selected: false,
                        treeModel: this.exportEntitiesService.getInitialTreeModel(t),
                        selection: null,
                    });
                })),
            takeUntilOnDestroy(this),
            finalize(() => this.showLoader = false),
        ).subscribe((config) => {
            this.intData(config);
        });
    }

    public intData(config: ExportConfig[]): void {
        this.config = _.sortBy(config, 'key');
        const isConfig = this.config && this.config.length > 0;
        this.selectedSpecs = isConfig ? [this.config[0].key] : [];
        this.currentSpecKey = isConfig ? this.config[0].key : null;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public checkType(type: ExportConfig, e: MatCheckboxChange): void {
        this.config = this.config.map(c => {
            if (c.key === type.key) {
                c.selected = e.checked;
            }
            return c;
        });
    }

    public onSelectionChange(): void {
        const selectedEntityKey = this.selectedSpecs[0];
        this.currentSpecKey = this.config.filter(c => c.key === selectedEntityKey)[0].key;
    }

    public onParamsChecked(data: { specKey: string, selection: ExportConfig[] }): void {
        this.config.forEach((s: ExportConfig) => {
            if (s.key === data.specKey) {
                s.selection = data.selection;
            }
        });
    }

    public export(): void {
        this.showLoader = true;
        const configSelectedEntities = this.config
            .filter(c => c.selected)
            .map(c => ({ selection: c.selection || [], key: c.key }));
        const payload = this.exportEntitiesService.mapPayload(configSelectedEntities);
        this.exportEntitiesService
            .getExportJson(payload)
            .pipe(
                finalize(() => this.showLoader = false),
                takeUntilOnDestroy(this),
            )
            .subscribe((resp: unknown) => {
                const json = JSON.stringify(resp);
                const blob = new Blob([json], { type: 'application/json' });
                const stamp = new Date().getTime();
                saveFile(blob, `export-${stamp}.json`, 'application/json');
                this.activeModal.close('success');
            });
    }
}
