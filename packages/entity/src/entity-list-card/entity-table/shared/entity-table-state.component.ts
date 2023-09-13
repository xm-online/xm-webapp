import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { EntityStateModule } from '../../../entity-state';
import { StateSpec, XmEntitySpecWrapperService } from '@xm-ngx/core/entity';
import { Observable, map } from 'rxjs';
import { XM_DYNAMIC_TABLE_ROW } from '@xm-ngx/dynamic';
import { get } from 'lodash';

export interface XmEntityTableStateConfig {
    typeKey?: string;
    typeKeyPath?: string;
}

@Component({
    standalone: true,
    imports: [
        AsyncPipe,
        EntityStateModule,
    ],
    selector: 'xm-entity-table-state',
    template: `
        <xm-entity-state [stateSpec]="stateSpec | async"></xm-entity-state>
    `,
})
export class XmEntityTableStateComponent implements OnInit {
    private xmEntitySpecService = inject(XmEntitySpecWrapperService);

    private row = inject(XM_DYNAMIC_TABLE_ROW, { optional: true });

    @Input() public config: XmEntityTableStateConfig;
    @Input() public value: string;   

    public stateSpec: Observable<StateSpec>;

    public ngOnInit(): void {
        const typeKey = this.getTypeKey();

        if (!this.value || !typeKey) {
            return;
        }

        this.stateSpec = this.xmEntitySpecService.getByTypeKey(typeKey).pipe(
            map((specs) => specs.states?.find(s => s.key === this.value)),
        );
    }

    private getTypeKey(): string | null {
        if (!this.row) {
            return this.config?.typeKey;
        }

        if (this.config?.typeKeyPath) {
            return get(this.row, this.config.typeKeyPath) as string | null;
        } else if (!this.config?.typeKey) {
            return get(this.row, 'typeKey') as string | null;
        }

        return this.config?.typeKey;
    }
}