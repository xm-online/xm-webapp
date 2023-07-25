import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { combineLatest, Observable } from 'rxjs';
import { delay, filter, shareReplay, startWith } from 'rxjs/operators';
import { getServerEnvironment } from './get-current-env';
import { CommonModule } from '@angular/common';
import { XmCoreConfig } from '@xm-ngx/core';


function changeFavicon(url: string): void {
    const link = document.querySelector<HTMLLinkElement>('link[rel*=\'icon\']') || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
}

@Component({
    selector: 'xm-ribbon',
    standalone: true,
    templateUrl: './xm-ribbon.component.html',
    styleUrls: ['./xm-ribbon.component.scss'],
    imports: [CommonModule],
})
export class XmRibbonComponent implements OnInit, OnDestroy {
    @Input() public config: {
        favicons: { url: string, server: string }[]
        hidden?: boolean
    };
    public serverEnv$: Observable<string> = getServerEnvironment().pipe(
        filter((r) => Boolean(r)),
        takeUntilOnDestroy(this),
        shareReplay(1));

    constructor(
        private uiConfigService: XmUiConfigService,
        public xmCoreConfig: XmCoreConfig,
    ) {
    }

    public ngOnInit(): void {
        document.body.setAttribute('data-release', this.xmCoreConfig.RELEASE);

        combineLatest([
            this.serverEnv$.pipe(startWith(null)),
            this.uiConfigService.config$().pipe(startWith(null)),
        ]).pipe(
            takeUntilOnDestroy(this),
            delay(700),
        ).subscribe(([server]) => {
            if (this.config && this.config.favicons) {
                const favicon = this.config.favicons.find((i) => i.server === server);
                if (favicon) {
                    changeFavicon(favicon.url);
                }
            }
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
