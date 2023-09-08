import { NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContextService } from '@xm-ngx/core/context';
import { XmEntity, XmEntitySpecWrapperService } from '@xm-ngx/core/entity';
import { XM_DYNAMIC_TABLE_ROW } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { get } from 'lodash';
import { Observable, catchError, finalize, map, of, switchMap, take } from 'rxjs';

export interface XmEntityTableLinkConfig {
    typeKey?: string;
    typeKeyPath?: string;
    noDeepLink?: boolean;
    routerLink?: string[];
}

@Component({
    standalone: true,
    selector: 'xm-entity-table-link',
    imports: [
        NgIf,
        XmTranslationModule,
    ],
    template: `
        <ng-container *ngIf="config?.noDeepLink; then entryHasNotLink else entryHasLink"></ng-container>

        <ng-template #entryHasLink>
            <a href="javascript: void(0);" (click)="onNavigate()">
                {{ value }}
            </a>
        </ng-template>

        <ng-template #entryHasNotLink>
            {{ value }}
        </ng-template>
    `,
})
export class XmEntityTableLinkComponent {    
    private xmEntitySpecService = inject(XmEntitySpecWrapperService);
    private contextService = inject(ContextService);
    private router = inject(Router);

    private row = inject(XM_DYNAMIC_TABLE_ROW, { optional: true }) as XmEntity;

    @Input() public config: XmEntityTableLinkConfig;
    @Input() public value: string;   

    public onNavigate(): void {
        if (!this.row) {
            return;
        }

        this.getRouterLink()
            .pipe(
                finalize(() => this.contextService.put('xmEntityId', this.row.id)),
                take(1),
            ).subscribe((commands) => this.router.navigate(commands));
    }

    private getTypeKey(): string | null {
        if (!this.row) {
            return this.config?.typeKey;
        }

        if (this.config?.typeKeyPath) {
            return get(this.row, this.config.typeKeyPath) as string | null;
        } else if (!this.config?.typeKey) {
            return get(this.row, 'typeKey');
        }

        return this.config?.typeKey;
    }

    private getRouterLink(): Observable<any[]> {
        if (this.config?.routerLink) {
            return this.buildRouterLink();
        }

        return this.getRouterLinkFromSpec();
    }

    private buildRouterLink(): Observable<string[]> {
        const result: string[] = [];
        for (const l of this.config?.routerLink) {
            if (l.startsWith('xmEntity')) {
                result.push(this.row[l.split('.').pop()]);
            } else {
                result.push(l);
            }
        }

        return of(result);
    }

    private getRouterLinkFromSpec(): Observable<string[]> {
        const typeKey = this.getTypeKey();

        return of(this.row).pipe(
            switchMap((entity) => {
                if (entity && entity.hasOwnProperty('type')) {
                    return of(entity.type);
                }

                return this.xmEntitySpecService.getByTypeKey(typeKey);
            }),
            map((spec) => {
                if (!spec) {
                    return [''];
                }
                const form: string = spec.dataForm || '{}';
                const entityConfig: any = JSON.parse(form).entity || {};
        
                return ['/application', typeKey, entityConfig.useKeyOnList ? this.row.key : `${this.row.id}`];
            }),
            catchError(() => of([''])),
        );
    }
}