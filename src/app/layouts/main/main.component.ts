import { Component, OnDestroy, OnInit } from '@angular/core';
import { UIPublicConfig, XmSessionService } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Observable } from 'rxjs';
import { XmApplicationConfigService } from '@xm-ngx/core/config';
import { VERSION } from '../../xm.constants';


@Component({
    selector: 'xm-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss', './heatmap-container.scss'],
})
export class XmMainComponent implements OnInit, OnDestroy {
    public resolved$: Observable<boolean> = this.xmConfigService.isResolved();
    public isGuestLayout: boolean = true;
    public config: UIPublicConfig = this.xmConfigService.getAppConfig();

    constructor(
        private xmConfigService: XmApplicationConfigService,
        private sessionService: XmSessionService,
    ) {
        // eslint-disable-next-line no-console
        console.log(`app version ${VERSION}`);
    }

    public ngOnInit(): void {
        this.sessionService.isActive().pipe(takeUntilOnDestroy(this)).subscribe(
            (auth) => this.isGuestLayout = !auth,
            () => this.isGuestLayout = true,
        );
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
