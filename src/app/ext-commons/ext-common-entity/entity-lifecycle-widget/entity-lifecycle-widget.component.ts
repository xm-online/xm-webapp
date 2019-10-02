import { Component, OnDestroy, OnInit } from '@angular/core';
import { EntityLifecycleWidgetOptions } from './entity-lifecycle-widget.model';
import { Spec, XmEntity, XmEntitySpec } from '../../../xm-entity';
import { Principal } from '../../../shared';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

@Component({
    selector: 'xm-entity-lifecycle-widget',
    templateUrl: './entity-lifecycle-widget.component.html',
    styleUrls: ['./entity-lifecycle-widget.component.scss'],
})
export class EntityLifecycleWidgetComponent implements OnInit, OnDestroy {

    public config: EntityLifecycleWidgetOptions;
    public spec: Spec;
    public xmEntitySpec: XmEntitySpec;
    public xmEntity: XmEntity;
    private entitySelectedSubscription: Subscription;

    constructor(public principal: Principal,
                private eventManager: JhiEventManager) {
    }

    public ngOnInit(): void {
        console.log(this);
        this.xmEntitySpec = this.config && this.spec.types.filter((t) => t.key === this.config.entity).shift();

        this.entitySelectedSubscription = this.eventManager.subscribe(this.config.subscribeEventName, (event) => {
            console.log(event.data);
            this.xmEntity = event.data || {};
        });
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.entitySelectedSubscription);
    }
}
