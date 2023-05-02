import { Injectable } from '@angular/core';
import { IEntityCollectionPageable } from '@xm-ngx/components/entity-collection';

import { XmLogger } from '@xm-ngx/logger';
import { XmToasterService } from '@xm-ngx/toaster';
import * as _ from 'lodash';

import {
    PAGEABLE_AND_SORTABLE_DEFAULT,
    PageableAndSortable,
} from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { firstValueFrom } from 'rxjs';
import { XmAlertService } from '@xm-ngx/alert';
import { cloneDeep } from 'lodash';
import {
    XmTableRepositoryResolver,
} from '@xm-ngx/components/table/repositories/xm-table-repository-resolver.service';
import {
    AXmTableStateCollectionController,
} from './a-xm-table-state-collection-controller.service';
import { IId } from '@xm-ngx/shared/interfaces';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { XmFilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableEntityController } from '../entity/xm-table-entity-controller.service';
import { filter } from 'rxjs/operators';

const TRS = {
    updated: 'ext-entity.commons.updated',
    deleted: 'ext-entity.commons.deleted',
    added: 'ext-entity.commons.added',
    alreadyExist: 'ext-entity.commons.already-exist',
};

export interface LinkListProperties {
    pickPath: string;
    asKey: string;
    useInitialType?: boolean;
}

export interface LinkListConfig {
    resource: string;
    path: string;
    typeLink: {
        primaryField: 'id' | string
        properties: string[] | LinkListProperties[],
    }
}

@Injectable()
export class XmTableLinkedCollectionController<T extends IId & {name?: string} = unknown>
    extends AXmTableStateCollectionController<T>
    implements IXmTableCollectionController<T> {
    public entity: IId;
    public config: LinkListConfig;

    private repository: IEntityCollectionPageable<T, PageableAndSortable>;

    constructor(
        protected toaster: XmToasterService,
        private configController: XmTableConfigController<LinkListConfig>,
        private entityController: XmTableEntityController<object>,
        protected alert: XmAlertService,
        protected repositoryResolver: XmTableRepositoryResolver<T>,
        protected logger: XmLogger,
    ) {
        super();
    }

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.config = await firstValueFrom(this.configController.config$());
        this.entity = await firstValueFrom(this.entityController.entity$());
        this.repository = await this.repositoryResolver.get();
        const primaryField = this.config?.typeLink?.primaryField || 'id';
        const data: T[] = _.get(this.entity, this.config.path, '') || [];
        let keys = data.map(i => i ? i[primaryField] : null);
        const isKeysValid = _.every(keys, i => Boolean(i) === true);

        if (!isKeysValid) {
            this.logger.error(
                `Invalid input data ${primaryField} is empty: `
                + `entity.id=${this.entity.id}, `
                + `path=${this.config.path}, `
                + `keys=[${keys.map(String).join(',')}]`);
            keys = keys.filter(i => Boolean(i));
        }

        if (keys.length === 0) {
            return;
        }

        const query = `${primaryField}:(${keys.join(' OR ')})`;
        this.changePartial({ loading: true });
        this.repository.query({ query })
            .subscribe(
                (res) => {
                    _.forEach(res.body, (item) => {
                        _.forEach(data, (source) => {
                            if (_.isEqual(item[primaryField], source[primaryField])) {
                                _.defaults(item, source);
                            }
                        });
                    });
                    this.change({
                        loading: false,
                        items: res.body,
                        pageableAndSortable: {
                            total: res.body.total,
                            pageSize: res.body.pageSize,
                            pageIndex: res.body.pageIndex,
                            sortBy: res.body.sortBy,
                            sortOrder: res.body.sortOrder,
                        },
                        error: null,
                    });
                },
                (error) => {
                    this.change({
                        loading: false,
                        items: [],
                        pageableAndSortable: cloneDeep(PAGEABLE_AND_SORTABLE_DEFAULT),
                        error: error,
                    });
                },
            );
    }

    public save(): void {
        const data = this._state.value.items.reduce((acc, i) => {
            return [
                ...acc,
                this.getProperties().reduce((props, value) => {
                    return {
                        ...props,
                        [value.asKey]: value.useInitialType ? _.get(i, value.pickPath) : String(_.get(i, value.pickPath)), // TODO: API workaround
                    };
                }, {}),
            ];
        }, []);

        _.set(this.entity, this.config.path, data);
    }

    public add(item: T): void {
        if (item.id) {
            this._add(item);
        } else {
            this._create(item);
        }
    }

    public remove(item: T, options?: _.Dictionary<any>): void {
        const primaryField = this.config?.typeLink?.primaryField || 'id';
        this.alert.delete(_.merge({ textOptions: { value: item.name } }, options)).pipe(
            filter((i) => i.value),
        ).subscribe(() => {
            const items = this.items.filter((i) => i !== item);
            this.repository.delete(item.id);
            this.toaster.create({
                type: 'success',
                text: TRS.deleted,
                textOptions: { value: String(item.name || item[primaryField]) },
            }).subscribe();
            this.changePartial({items: items});
        });
    }

    public edit(item: T, newItem: T): void {
        // const primaryField = this.config?.typeLink?.primaryField || 'id';
        this.repository.update(_.assign(item, newItem)).subscribe(() => {
            this.toaster.create({
                type: 'success',
                text: TRS.updated,
                // textOptions: { value: String(item.name || item[primaryField]) },
            }).subscribe();
            // TODO:
            // _.assign(item, newItem);
            // this.changePartial(items);
        });
    }

    public reset(): void {
        this.load(null);
    }

    private _create(item: T): void {
        // const primaryField = this.config?.typeLink?.primaryField || 'id';
        this.repository.create(item).subscribe((res) => {
            this.toaster.create({
                type: 'success',
                text: TRS.added,
                // textOptions: { value: String(item.name || item[primaryField]) },
            }).subscribe();
            this._add(_.assign(item, res));
        });
    }

    private _add(item: T): void {
        const primaryField = this.config?.typeLink?.primaryField || 'id';
        if (this.items.find(i => i[primaryField] === item[primaryField])) {
            this.toaster.create({
                type: 'warning',
                text: TRS.alreadyExist,
                // textOptions: { value: String(item.name || item[primaryField]) },
            }).subscribe();
            return;
        }

        const items = this.items;
        items.push(item);
        this.changePartial({ items });
    }

    private getProperties(): LinkListProperties[] {
        const primaryField = this.config?.typeLink?.primaryField || 'id';
        if (this.config?.typeLink?.properties) {
            return this.config.typeLink.properties.map<LinkListProperties>((value: string | LinkListProperties) => {
                if (!_.isObject(value)) {
                    return {
                        asKey: value,
                        pickPath: value,
                    };
                }

                return value;
            });
        }
        return [{
            pickPath: primaryField,
            asKey: primaryField,
        }, {
            pickPath: 'name',
            asKey: 'name',
        }];
    }
}
