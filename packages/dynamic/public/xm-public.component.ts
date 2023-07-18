import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { XmPublicUiConfigService } from '@xm-ngx/core';

import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import * as _ from 'lodash';
import { Observable, zip } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { XmUIConfig } from '@xm-ngx/core/config';
import { XmLayout } from '@xm-ngx/dynamic';

interface PublicSlugLayout {
    slug: string;
    layout: (XmLayout & { config?: unknown }) [];
}

interface PublicConfig extends XmUIConfig {
    public: {
        routes: PublicSlugLayout[];
    };
}

@Component({
    selector: 'xm-public',
    templateUrl: './xm-public.component.html',
})
export class XmPublicComponent implements OnInit, OnDestroy {

    public layouts$: Observable<XmLayout[]>;

    constructor(
        private publicUiConfig: XmPublicUiConfigService<PublicConfig>,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
    }

    public ngOnInit(): void {
        const slug$: Observable<string> = this.activatedRoute.params
            .pipe(
                takeUntilOnDestroy(this),
                map(p => p.slug),
            );

        const routes$: Observable<PublicSlugLayout[]> = this.publicUiConfig.config$().pipe(
            takeUntilOnDestroy(this),
            map((c) => _.get(c, 'public.routes', null)),
            filter<PublicSlugLayout[]>(Boolean),
        );

        this.layouts$ = zip(slug$, routes$).pipe(
            map(([slug, routes]) => routes.find(i => i.slug === slug)),
            map((r) => {
                if (!r) {
                    this.router.navigateByUrl('/accessdenied');
                }

                return r.layout;
            }),
            shareReplay(1),
        );
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
