import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { cloneDeepWith } from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class PageParamsStore {

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    public get<T>(): any {
        return cloneDeepWith(this.activatedRoute.snapshot.queryParams, (obj) => {
            if (typeof obj === 'boolean') {
                return obj;
            } else if (typeof obj === 'string' && obj === 'true') {
                return true;
            } else if (typeof obj === 'string' && obj === 'false') {
                return false;
            } else if (typeof obj === 'string'
                && obj.match(/\d\d\d\d-\d\d-\d\d/)
                && new Date(obj) instanceof Date) {
                return new Date(obj);
            } else if (!isNaN(obj)) {
                return +obj;
            } else if (typeof obj === 'string' && obj.startsWith('{')) {
                // nested object
                return JSON.parse(obj);
            }
            return undefined;
        });
    }

    public store<T>(value: T): void {
        const queryParams = cloneDeepWith(value, (obj) => {
            if (obj instanceof Date) {
                return obj.toISOString();
            } else if (typeof obj === 'object' && value !== obj && obj !== null) {
                // nested object
                return JSON.stringify(obj);
            } else if (Number.isInteger(obj)) {
                return obj as number;
            } else if (obj === '') {
                return null;
            }
            return undefined;
        });

        this.router.navigate([],
            {
                relativeTo: this.activatedRoute,
                queryParams,
                queryParamsHandling: ''
            });
    }
}
