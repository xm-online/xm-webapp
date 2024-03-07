import { inject, Injectable } from '@angular/core';

import { XmEntity } from '@xm-ngx/core/entity';
import * as _ from 'lodash';
import {
    AXmTableLocalPageableCollectionController,
} from './a-xm-table-local-pageable-collection-controller.service';

import { cloneDeep, set } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { XmFilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableEntityController } from '../controllers/entity/xm-table-entity-controller.service';
import { XmConfig } from '@xm-ngx/interfaces';
import { XmDynamicInjectionTokenStoreService } from '@xm-ngx/dynamic';
import {
    filter,
    take
} from 'rxjs/operators';
import { XmTableArrayCollectionControllerConfig } from '@xm-ngx/components/table';
import { XmAlertService } from '@xm-ngx/alert';

interface StringArrayListManagerItem {
    value: string;
}

export interface StringArrayListConfig extends XmConfig {
    type: 'stringArray'
    path: string,
    entityController?: {
        key?: string,
    },
}

@Injectable()
export class XmTableStringArrayCollectionController<T extends StringArrayListManagerItem = StringArrayListManagerItem>
    extends AXmTableLocalPageableCollectionController<T>
    implements IXmTableCollectionController<T> {
    public entity: XmEntity;
    public declare config: StringArrayListConfig;

    private injectionTokenService = inject(XmDynamicInjectionTokenStoreService);
    private entityController = inject<XmTableEntityController<object>>(XmTableEntityController, {optional: true});
    protected alert: XmAlertService = inject(XmAlertService);

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.entity = await firstValueFrom(this.getEntityController().entity$());
        const primary = _.get(this.entity, this.config.path, []);
        const modify = primary.map((i) => ({value: i} as T));
        this.items = modify;
    }

    public save(): void {
        const items = this.items.map((i) => i.value);
        set(this.entity, this.config.path, cloneDeep(items));
        this.getEntityController().update(this.entity);
    }

    private getEntityController(): XmTableEntityController<object> {
        return this.injectionTokenService.getControllerByKey(this.config?.entityController?.key || 'table-entity-controller') || this.entityController;
    }

    public remove(item: T, options?: XmTableArrayCollectionControllerConfig): void {
        this.alert.delete(options).pipe(
            take(1),
            filter((i) => i.value),
        ).subscribe(() => {
            super.remove(item);
            this.save();
        });
    }

    public edit(item: T, newItem: T): void {
        super.edit(item, newItem);
        this.save();
    }
}
