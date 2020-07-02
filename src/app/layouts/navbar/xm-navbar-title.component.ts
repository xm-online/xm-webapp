import { Component, DoCheck, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'xm-navbar-title',
    template: `
        <div *ngIf="routeData && title"
             class="navbar-container-part title-part">
      <span [innerHTML]="titleContent"
            [title]="title"
            class="d-none d-sm-block"></span>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
})

export class XmNavbarTitleComponent implements OnInit, DoCheck {
    public routeData: any = {};
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

    public ngOnInit(): void {
        this.routeData = this.getRouteData(this.router.routerState.snapshot.root);

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.routeData = this.getRouteData(this.router.routerState.snapshot.root);
            }
        });
    }

    private getRouteData(routeSnapshot: ActivatedRouteSnapshot): string {
        let rData;

        if (routeSnapshot.data) {
            rData = routeSnapshot.data;
        }

        if (routeSnapshot.firstChild) {
            rData = this.getRouteData(routeSnapshot.firstChild) || this.routeData;
        }

        return rData;
    }

    // TODO: refactor
    private processTitle(routData: any): void {
        let titlePart1 = this.translateOrEmpty(routData.pageTitle);
        let titlePart2 = routData.pageSubTitle || routData.pageSubTitleTrans ? ' - ' : '';
        let titlePart3 = routData.pageSubTitle ? routData.pageSubTitle : '';
        let titlePart4 = this.translateOrEmpty(routData.pageSubTitleTrans);
        let titlePart5 = routData.pageSubSubTitle || routData.pageSubSubTitleTrans ? ' - ' : '';
        let titlePart6 = routData.pageSubSubTitle ? routData.pageSubSubTitle : '';
        let titlePart7 = this.translateOrEmpty(routData.pageSubSubTitleTrans);
        this.title = titlePart1 + titlePart2 + titlePart3 + titlePart4 + titlePart5 + titlePart6 + titlePart7;
        titlePart1 = `<span class="title-part-1">${titlePart1}</span>`;
        titlePart2 = `<span class="title-part-2">${titlePart2}</span>`;
        titlePart3 = `<span class="title-part-3">${titlePart3}</span>`;
        titlePart4 = `<span class="title-part-4">${titlePart4}</span>`;
        titlePart5 = `<span class="title-part-5">${titlePart5}</span>`;
        titlePart6 = `<span class="title-part-6">${titlePart6}</span>`;
        titlePart7 = `<span class="title-part-7">${titlePart7}</span>`;
        this.titleContent = titlePart1 + titlePart2 + titlePart3 + titlePart4 + titlePart5 + titlePart6 + titlePart7;
    }

    private translateOrEmpty(item: string): string {
        return item ? this.translateService.instant(item) : '';
    }
}
