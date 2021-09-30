import { ChangeDetectionStrategy, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { XmLayout } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { get } from 'lodash';

import { XmSidebarStoreService } from './stores/xm-sidebar-store.service';
import { XmSidebarPresentationType } from './stores/xm-sidebar.state';

interface SidebarConfig {
    user: unknown;
    layout: XmLayout[]
}

export const XM_SIDEBAR_PRESENTATION_STATE_CLASSES = {
    [XmSidebarPresentationType.Open]: 'xm-sidebar-presentation-open',
    [XmSidebarPresentationType.Close]: 'xm-sidebar-presentation-close',
    [XmSidebarPresentationType.Tablet]: 'xm-sidebar-presentation-tablet',
};

export const XM_SIDEBAR_PRESENTATION_STATE_WIDTH = {
    [XmSidebarPresentationType.Open]: '256px',
    [XmSidebarPresentationType.Close]: '0',
    [XmSidebarPresentationType.Tablet]: '64px',
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
    @Input() public mainContainer: HTMLElement | null;

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
                // TODO: extract from sidebar to main-container as a listener
                if (this.mainContainer) {
                    this.mainContainer.style.marginLeft = XM_SIDEBAR_PRESENTATION_STATE_WIDTH[i];
                }
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
        // TODO: extract from sidebar to main-container as a listener
        // guest page or auth page
        if (this.mainContainer) {
            this.mainContainer.style.marginLeft = '0';
        }
    }
}
