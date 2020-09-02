import { Component, OnDestroy, OnInit } from '@angular/core';
import { XmConfigService } from '../../../../../src/app/shared';
import { finalize, map } from 'rxjs/operators';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
    ExportEntitiesService,
} from '@xm-ngx/administration/maintenance/export-entities.service';
import { saveFile } from '../../../../../src/app/shared/helpers/file-download-helper';

import * as _ from 'lodash';

@Component({
    selector: 'xm-export-entities-details',
    templateUrl: './export-entities-details.component.html',
    styleUrls: ['./export-entities-details.component.scss'],
})
export class ExportEntitiesDetailsComponent implements OnInit, OnDestroy {

    public showLoader: boolean = true;
    public config: any;
    public selectedSpecs: string[];
    public currentSpecKey: string;

    constructor(private service: XmConfigService, private exportEntitiesService: ExportEntitiesService) {
    }

    public ngOnInit(): void {
        this.service
            .getConfigJson('/entity/xmentityspec.yml?toJson')
            .pipe(
                map((config) => {
                    return config.types.map(t => {
                        return Object.assign(t, {
                            selected: false,
                            treeModel: this.exportEntitiesService.getInitialTreeModel(t),
                            selection: null,
                        })
                    })
                }),
                takeUntilOnDestroy(this),
                finalize(() => this.showLoader = false),
            ).subscribe((config) => {
                this.intData(config)
            });
    }

    public intData(config: any[]): void {
        this.config = _.sortBy(config, 'key');
        const isConfig = this.config && this.config.length > 0;
        this.selectedSpecs = isConfig ? [this.config[0].key] : [];
        this.currentSpecKey = isConfig ? this.config[0].key : null;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public checkType(type: any, e: MatCheckboxChange): void {
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

    public onParamsChecked(data: any): void {
        this.config.forEach(s => {
            if (s.key === data.specKey) {
                s.selection = data.selection
            }
        });
    }

    public export() {
        this.showLoader = true;
        const configSelectedEntities = this.config
                                            .filter(c => c.selected)
                                            .map(c => ({selection: c.selection || [], key: c.key}));

        const payload = this.exportEntitiesService.mapPayload(configSelectedEntities);
        this.exportEntitiesService
            .getExportJson(payload)
            .pipe(
                finalize(() => this.showLoader = false),
                takeUntilOnDestroy(this),
            )
            .subscribe((resp: any) => {
                const json = JSON.stringify(resp);
                const blob = new Blob([json], {type: 'application/json'});
                saveFile(blob, 'entities.json', 'application/json');
            });
    }
}
