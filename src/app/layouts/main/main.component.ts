import { Component, OnDestroy, OnInit } from '@angular/core';
import { XmSidebarPresentationType, XmSidebarStoreService } from '@xm-ngx/components/sidebar';
import { UIPublicConfig, XmSessionService } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Observable } from 'rxjs';
import { XmApplicationConfigService } from '../../shared/spec';
import { VERSION } from '../../xm.constants';


@Component({
    selector: 'xm-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss', './heatmap-container.scss'],
})
export class XmMainComponent implements OnInit, OnDestroy {
    public resolved$: Observable<boolean> = this.xmConfigService.isResolved();
    public isGuestLayout: boolean = true;
    public hideIfEmpty: boolean = false;
    public config: UIPublicConfig = this.xmConfigService.getAppConfig();

    constructor(
        private xmConfigService: XmApplicationConfigService,
        private sessionService: XmSessionService,
        private sidebarStoreService: XmSidebarStoreService,
    ) {
        // eslint-disable-next-line no-console
        console.log(`app version ${VERSION}`);
    }

    public ngOnInit(): void {
        this.sessionService.isActive().pipe(takeUntilOnDestroy(this)).subscribe(
            (auth) => this.isGuestLayout = !auth,
            () => this.isGuestLayout = true,
        );
        this.sidebarStoreService.onPresentationChange.pipe(takeUntilOnDestroy(this)).subscribe(
            (presentationType: XmSidebarPresentationType) => 
                this.hideIfEmpty = presentationType === XmSidebarPresentationType.Close,
        );
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
