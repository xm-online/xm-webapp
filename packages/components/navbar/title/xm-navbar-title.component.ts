import { CommonModule } from '@angular/common';
import { Component, DoCheck, NgModule, OnInit, Type } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Translate } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { filter } from 'rxjs/operators';

interface RouteData {
    pageTitle?: Translate;
    pageSubTitle?: Translate;
    pageSubSubTitle?: Translate;
}

@Component({
    selector: 'xm-navbar-title',
    styleUrls: ['./xm-navbar-title.scss'],
    template: `
        <div *ngIf="routeData && title"
             class="title-part px-3">
            <span [innerHTML]="titleContent"
                  [title]="title"
                  class="d-none d-sm-inline"></span>
        </div>
    `,
})

export class XmNavbarTitleComponent implements OnInit, DoCheck {
    public routeData: RouteData = {};
    public titleContent: string;
    public title: string;

    constructor(
        private router: Router,
        private translateService: TranslateService,
    ) {
    }

    public ngDoCheck(): void {
        this.processTitle(this.routeData);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public ngOnInit(): void {
        this.routeData = this.getRouteData(this.router.routerState.snapshot.root);

        this.router.events
            .pipe(filter((e) => e instanceof NavigationEnd))
            .subscribe(() => {
                this.routeData = this.getRouteData(this.router.routerState.snapshot.root);
            });
    }

    private getRouteData(routeSnapshot: ActivatedRouteSnapshot): RouteData {
        let rData;

        if (routeSnapshot.data) {
            rData = routeSnapshot.data;
        }

        if (routeSnapshot.firstChild) {
            rData = this.getRouteData(routeSnapshot.firstChild) || this.routeData;
        }

        return rData;
    }

    private processTitle(routData: RouteData): void {
        const pageTitle = this.translateOrEmpty(routData.pageTitle);
        const pageSubTitleTrans = this.translateOrEmpty(routData.pageSubTitle);
        const pageSubSubTitleTrans = this.translateOrEmpty(routData.pageSubSubTitle);
        const titles = _.compact([pageTitle, pageSubTitleTrans, pageSubSubTitleTrans]);
        this.title = titles.join('-');
        this.titleContent = titles
            .map((title, ix) => `<span class="title-part-${ix + 1}">${title}</span>\n`)
            .join('<span class="title-part">-</span>\n');
    }

    private translateOrEmpty(item: Translate): string {
        return item ? this.translateService.instant(item as string) : '';
    }
}

@NgModule({
    exports: [XmNavbarTitleComponent],
    declarations: [XmNavbarTitleComponent],
    imports: [
        CommonModule,
    ],
})
export class XmNavbarTitleModule {
    public entry: Type<XmNavbarTitleComponent> = XmNavbarTitleComponent;
}
