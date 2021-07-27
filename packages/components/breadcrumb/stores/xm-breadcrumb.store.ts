import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { XmBreadcrumb } from '../interfaces/xm-breadcrumb.interface';
import { XmBreadcrumbResolver } from '../reolvers/xm-breadcrumb.resolver';

@Injectable()
export class XmBreadcrumbStore implements OnDestroy {

    private readonly breadcrumbs = new BehaviorSubject<XmBreadcrumb[]>([]);
    public readonly breadcrumbs$: Observable<XmBreadcrumb[]> = this.breadcrumbs.asObservable();

    private subscription: Subscription;

    constructor(
        private router: Router,
        breadcrumbResolver: XmBreadcrumbResolver,
    ) {
        this.subscription = this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
        ).subscribe(() => {
            const root = this.router.routerState.snapshot.root;
            const breadcrumbs: XmBreadcrumb[] = breadcrumbResolver.getBreadcrumbs(root);
            this.breadcrumbs.next(breadcrumbs);
        });
    }

    public ngOnDestroy(): void {
        this.breadcrumbs.complete();
        this.subscription.unsubscribe();
    }
}
