import * as _ from 'lodash';

import { firstValueFrom } from 'rxjs';

import {
    AXmTableLocalPageableCollectionController,
} from './a-xm-table-local-pageable-collection-controller.service';
import { Injectable } from '@angular/core';
import { XmFilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { XmTableEntityController } from '../entity/xm-table-entity-controller.service';
import { XmTableWidgetConfig } from '../../table-widget/xm-table-widget.config';

export interface AtTypeListConfig {
    type: 'atType',
    key: string;
    path: string;
    atTypeKey: string
}

export interface AtType {
    atType?: string
}

/**
 * @example
 * ```
 * {
 *     field1: { atType: 'filed_1', ... }
 *     field2: { atType: 'filed_2', ... }
 * }
 * ```
 */
@Injectable()
export class XmTableAtTypeCollectionController<T extends AtType = AtType>
    extends AXmTableLocalPageableCollectionController<T>
    implements IXmTableCollectionController<T> {
    private entity: object;
    public config: AtTypeListConfig;
    private initialData: T[];

    constructor(
        private configController: XmTableConfigController<XmTableWidgetConfig>,
        private entityController: XmTableEntityController<object>,
    ) {
        super();
    }

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.config = (await firstValueFrom(this.configController.config$())).collection as AtTypeListConfig;
        this.entity = await firstValueFrom(this.entityController.entity$());
        const primary: { [key: string]: T } = _.get(this.entity, this.config.path, {});
        let clone = _.cloneDeep(primary);

        if (this.config.key) {
            clone = _.pick(clone, this.config.key);
        }

        _.forIn(clone, (v, k) => {
            if (typeof v === 'object') {
                v.atType = k;
            }
        });

        this.items = _.values(clone).filter(i => i && i.atType);
        this.initialData = _.cloneDeep(this.items);
    }

    public add(item: T): void {
        const list = this.items;
        const idx = _.findIndex(list, (i) => i.atType === item.atType);
        if (idx === -1) {
            list.push(item);
        } else {
            list[idx] = item;
        }
        this.items = list;
    }

    public save(): void {
        let source = _.get(this.entity, this.config.path);
        const items = this.items;

        if (!source) {
            source = {};
            _.set(this.entity, this.config.path, source);
        }

        const shouldDelete = _.differenceBy(this.initialData, items, 'atType');

        if (shouldDelete.length !== 0) {
            _.forEach(shouldDelete, (i) => delete source[i.atType]);
        }
        _.forEach(items, (i) => source[i.atType] = i);
        this.entityController.update(this.entity);
    }
}
