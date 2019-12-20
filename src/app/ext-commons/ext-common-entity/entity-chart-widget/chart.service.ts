import { Injectable } from '@angular/core';
import { XmEntity } from '../../../xm-entity';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ChartService {

    constructor() {
    }

    public exposeValues(options: any, entity: XmEntity): any | null {
        let value = null;
        try {
            value = options.seriesSelector.split('.').reduce((a, b) => a[b], entity);
        } catch (e) {
            if (!environment.production) { console.info(e); }
        }
        return value ;
    }

    public exposeLabels(options: any, entity: XmEntity): any | null {
        let value = null;
        try {
            value = options.labelSelector.split('.').reduce((a, b) => a[b], entity);
        } catch (e) {
            if (!environment.production) { console.info(e); }
        }
        return value ;
    }

    public exposeClassPath(options: any, entity: XmEntity): any | null {
        let value = null;
        try {
            value = options.classNamePath.split('.').reduce((a, b) => a[b], entity);
        } catch (e) {
            if (!environment.production) { console.info(e); }
        }
        return value ;
    }
}
