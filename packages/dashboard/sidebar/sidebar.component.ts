import { ChangeDetectionStrategy, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { XmDynamicLayout } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { get } from 'lodash';

import { XmSidebarStoreService } from './stores/xm-sidebar-store.service';
import { XmSidebarPresentationType } from './stores/xm-sidebar.state';

interface SidebarConfig {
    user: unknown;
    layout: XmDynamicLayout[]
}

export const XM_SIDEBAR_PRESENTATION_STATE_CLASSES = {
    [XmSidebarPresentationType.Close]: 'xm-sidebar-presentation-close',
    [XmSidebarPresentationType.Open]: 'xm-sidebar-presentation-open',
    [XmSidebarPresentationType.Tablet]: 'xm-sidebar-presentation-tablet',
};

@Component({
    selector: 'xm-sidebar',
    host: {
        class: 'xm-sidebar',
    },
    styleUrls: ['./sidebar.component.scss', './xm-sidebar-state.component.scss'],
    templateUrl: './sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmSidebarComponent implements OnInit, OnDestroy {
    public config: SidebarConfig;

    @HostBinding('class') public classes: string;

    constructor(
        private xmSidebarStoreService: XmSidebarStoreService,
        private xmConfigService: XmUiConfigService<{ sidebar: SidebarConfig }>,
    ) {
    }

    public ngOnInit(): void {
        this.xmConfigService.config$()
            .pipe(takeUntilOnDestroy(this))
            .subscribe(
                (config) => this.config = get(config, 'sidebar'),
            );

        this.xmSidebarStoreService.onPresentationChange
            .pipe(takeUntilOnDestroy(this))
            .subscribe(i => {
                this.classes = XM_SIDEBAR_PRESENTATION_STATE_CLASSES[i];
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
