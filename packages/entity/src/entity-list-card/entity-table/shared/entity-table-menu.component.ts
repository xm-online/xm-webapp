import { Component, inject, Input } from '@angular/core';
import { FunctionSpec, XmEntityService } from '@xm-ngx/core/entity';
import { saveFile } from '@xm-ngx/operators';
import { take, tap } from 'rxjs';

export interface XmEntityTableMenuConfig {
    typeKey: string;
    functions?: FunctionSpec[];
}

// TODO: Make it standalone, but before ensure that xm-function-list-section is also standalone
@Component({
    selector: 'xm-entity-table-menu',
    template: `
        <div class="dropdown xm-entity-list-actions">
            <button [matMenuTriggerFor]="entityListActions" mat-icon-button>
                <mat-icon>more_vert</mat-icon>
            </button>

            <mat-menu #entityListActions="matMenu">
                <ng-container *ngIf="config?.functions && config?.functions.length">
                    <xm-function-list-section [functionSpecs]="config?.functions"
                                              [listView]="true"></xm-function-list-section>
                </ng-container>

                <button *xmPermitted="['XMENTITY.EXPORT.FILE']"
                        [matMenuTriggerFor]="entityListActionDownloads"
                        class="btn-sm"
                        mat-menu-item>
                    {{ 'xm-entity.entity-list-card.export.action.downloads' | translate }}
                </button>
            </mat-menu>

            <mat-menu #entityListActionDownloads="matMenu">
                <button (click)="onFileExport('xlsx')" class="btn-sm" mat-menu-item>
                    {{ 'xm-entity.entity-list-card.export.action.xls' | translate }}
                </button>

                <button (click)="onFileExport('csv');" class="btn-sm" mat-menu-item>
                    {{ 'xm-entity.entity-list-card.export.action.csv' | translate }}
                </button>
            </mat-menu>
        </div>
    `,
    standalone: false,
})
export class XmEntityTableMenuComponent {
    @Input() public config: XmEntityTableMenuConfig;
    private xmEntityService = inject(XmEntityService);

    public onFileExport(exportType: string): void {
        if (!this.config.typeKey) {
            console.warn('Missing typeKey');
            return;
        }

        this.xmEntityService.fileExport(exportType, this.config.typeKey).pipe(
            // TODO: file name extract from the headers
            tap((resp: Blob) => saveFile(resp, `${this.config.typeKey}.` + exportType, 'text/csv')),
            take(1),
        ).subscribe(() => {
            console.info(`Exported ${this.config.typeKey}`);
        });
    }
}