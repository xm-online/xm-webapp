import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { Principal } from '../../../shared';
import { Spec, XmEntity, XmEntitySpec } from '../../../xm-entity';
import { IEntityLifecycleWidgetConfig, ILifecycleItem } from './entity-lifecycle-widget.model';

@Component({
    selector: 'xm-entity-lifecycle-widget',
    templateUrl: './entity-lifecycle-widget.component.html',
    styleUrls: ['./entity-lifecycle-widget.component.scss'],
})
export class EntityLifecycleWidgetComponent implements OnInit, OnDestroy {

    public config: IEntityLifecycleWidgetConfig;
    public spec: Spec;
    public xmEntitySpec: XmEntitySpec;
    public xmEntity: XmEntity;
    public items: ILifecycleItem[];
    private entitySelectedSubscription: Subscription;

    constructor(public principal: Principal,
                private eventManager: JhiEventManager) {
    }

    public ngOnInit(): void {
        console.log('----------- init -----------', this);
        this.xmEntitySpec = this.config && this.spec.types.filter((t) => t.key === this.config.entity).shift();

        this.entitySelectedSubscription = this.eventManager.subscribe(this.config.subscribeEventName, (event) => {
            this.xmEntity = event.data || null;

            if (this.xmEntity) {
                console.log('--- items ---', this.items);
                this.items = [].slice();
                let statuses = this.config.statuses.slice();

                statuses.forEach( (item) => {
                    item.stateKeys.forEach( (sk) => {
                        if (sk === this.xmEntity.stateKey) {
                            item.isCurrent = true;
                        } else { item.isCurrent = false; }
                    });
                    item.isColored = false;
                    return item;
                });
                console.log('--- statuses ---', statuses);
                // @ts-ignore
                statuses.reduceRight( (prev, cur) => {
                    console.log(prev, cur);
                    if (prev.isCurrent || prev.isColored) {
                        prev.isColored = true;
                        cur.isColored = true;
                    }
                    return cur;
                });
                this.items = statuses.slice();
            }
        });
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.entitySelectedSubscription);
    }
}
