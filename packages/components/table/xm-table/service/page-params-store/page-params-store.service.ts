import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PageParamsStore {

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    public get<T>(): any {
        return this.activatedRoute.snapshot.queryParams || {};
    }

    public store<T>(value: T): void {
        const queryParams = value;

        this.router.navigate([],
            {
                relativeTo: this.activatedRoute,
                queryParams,
                queryParamsHandling: 'preserve'
            });
    }
}
