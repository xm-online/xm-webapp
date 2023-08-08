import { inject, Injectable } from '@angular/core';
import {
    PageEntityState,
    PageEntityStore
} from '@xm-ngx/ext/entity-webapp-ext/module/page-entity-widget/entity/page-entity-store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class XmTableEntityController<T = unknown> {

    private pageEntityStore = inject<PageEntityStore<T>>(PageEntityStore);

    public entity$(): Observable<T> {
        // TODO:FEATURE: support entity in context
        return this.pageEntityStore.state$().pipe(
            filter(state => state === PageEntityState.LOADED),
            map(() => this.pageEntityStore.entity()),
        );
    }

    public update(entity: T): void {
        // TODO:FEATURE: support entity in context
        this.pageEntityStore.update(entity);
    }
}
