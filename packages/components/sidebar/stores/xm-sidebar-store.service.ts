import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { XM_SIDEBAR_CONFIG, XmSidebarConfig } from '../configs/xm-sidebar.config';
import { defaults } from 'lodash';
import { XmSidebarPresentationType, XmSidebarState } from './xm-sidebar.state';

@Injectable()
export class XmSidebarStoreService {
    private store: BehaviorSubject<XmSidebarState>;

    constructor(@Inject(XM_SIDEBAR_CONFIG) config: XmSidebarConfig) {
        this.store = new BehaviorSubject<XmSidebarState>(config.defaultState);
    }

    public get onPresentationChange(): Observable<XmSidebarPresentationType> {
        return this.store.pipe(map(i => i.presentationType));
    }

    public get state(): XmSidebarState {
        return this.store.value;
    }

    public setPresentationType(displayType: XmSidebarPresentationType): void {
        const newValue = { presentationType: displayType };
        const prevValue = this.store.value;
        this.store.next(defaults(newValue, prevValue));
    }
}

