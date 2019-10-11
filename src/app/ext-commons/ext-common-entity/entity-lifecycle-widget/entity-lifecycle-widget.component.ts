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
    public statuses: ILifecycleItem[];
    public items: ILifecycleItem[];
    private entitySelectedSubscription: Subscription;

    constructor(public principal: Principal,
                private eventManager: JhiEventManager) {
    }

    public ngOnInit(): void {
        console.log(this);
        this.xmEntitySpec = this.config && this.spec.types.filter((t) => t.key === this.config.entity).shift();

        this.entitySelectedSubscription = this.eventManager.subscribe(this.config.subscribeEventName, (event) => {
            console.log(event);
            this.xmEntity = event.data || null;
            this.items = [];
            this.statuses = [];
            if (this.xmEntity) {
                this.statuses = this.config && this.config.statuses.map( (item) => {
                    item.stateKeys.forEach( (sk) => {
                        if (sk === this.xmEntity.stateKey) {
                            item.isCurrent = true;
                        }
                    });
                    return item;
                });
                this.statuses.reduceRight( (prev, cur) => {
                    console.log(prev, cur);
                    if (prev) {
                        if (prev.isCurrent || prev.isColored) {
                            prev.isColored = true;
                            cur.isColored = true;
                        }
                        this.items.unshift(prev);
                        if (this.statuses[0] === cur) {
                            this.items.unshift(cur);
                        }
                    }
                } );
            }
        });
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.entitySelectedSubscription);
    }
}
