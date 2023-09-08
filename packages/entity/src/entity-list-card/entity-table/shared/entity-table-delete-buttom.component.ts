import { Component, Input, inject } from '@angular/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmEventManager } from '@xm-ngx/core';
import { XmEntityService } from '@xm-ngx/core/entity';
import { XM_ENTITY_EVENT_LIST } from '../../../constants';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmTranslateService } from '@xm-ngx/translation';
import { XmTranslationModule } from 'lib/translation';
import { catchError, filter, of, switchMap, take, tap } from 'rxjs';
import { get } from 'lodash';
import { MatIconModule } from '@angular/material/icon';
import { XM_DYNAMIC_TABLE_ROW } from '@xm-ngx/dynamic';

export interface XmEntityTableDeleteButtonConfig {
   pathAsDeleteId: string;
}

@Component({
    standalone: true,
    selector: 'xm-entity-table-delete-button',
    imports: [
        MatIconModule,
        XmTranslationModule,
    ],
    template: `
        <a (click)="onRemove()" href="javascript: void(0);">
          <mat-icon>close</mat-icon>
        </a>
    `,
})
export class XmEntityTableDeleteButtonComponent {
    private alertService = inject(XmAlertService);
    private translateService = inject(XmTranslateService);
    private xmEntityService = inject(XmEntityService);
    private toasterService = inject(XmToasterService);
    private eventManager = inject(XmEventManager);

    private row = inject(XM_DYNAMIC_TABLE_ROW, { optional: true });

    @Input() public config: XmEntityTableDeleteButtonConfig;

    public onRemove(): void {
        const id = this.getId();

        if (!id) {
            return;
        }

        this.alertService.open({
            title: 'xm-entity.entity-list-card.delete.title',
            showCancelButton: true,
            confirmButtonText: 'xm-entity.entity-list-card.delete.button',
            cancelButtonText: this.translateService.translate('xm-entity.entity-list-card.delete.button-cancel'),
        }).pipe(
            filter((result) => result?.value),
            switchMap(() => this.xmEntityService.delete(id).pipe(
                tap(() => {
                    this.eventManager.broadcast({
                        name: XM_ENTITY_EVENT_LIST.XM_ENTITY_LIST_MODIFICATION,
                    });
                    this.toasterService.success('xm-entity.entity-list-card.delete.remove-success');
                }),
                catchError(() => {
                    this.toasterService.error('xm-entity.entity-list-card.delete.remove-error');

                    return of(null);
                }),
            )),
            take(1),
        ).subscribe();
    }

    private getId(): string | null {
        if (!this.row) {
            return null;
        }

        return get(this.row, this.config?.pathAsDeleteId, null) as string | null;
    }
}