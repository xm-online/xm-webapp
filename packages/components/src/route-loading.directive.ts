import { Directive, Host, NgModule } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { LoaderComponent } from '@xm-ngx/components/loader';

@Directive({ selector: '[routerLoading]' })
export class RouteLoadingDirective {
    public loading: boolean = false;

    constructor(
        @Host() host: LoaderComponent,
        private router: Router) {
        this.router.events.subscribe((event: Event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.loading = true;
                    host.showLoader = true;
                    break;
                }

                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.loading = false;
                    host.showLoader = false;
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }
}

@NgModule({
    exports: [RouteLoadingDirective],
    declarations: [RouteLoadingDirective],
})
export class RouteLoadingDirectiveModule {
}
