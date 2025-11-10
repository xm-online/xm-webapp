import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { XmDynamicLayout } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { get } from 'lodash';

import { XmSidebarStoreService } from './stores/xm-sidebar-store.service';
import { XmSidebarPresentationType } from './stores/xm-sidebar.state';
import { MenuService } from '@xm-ngx/components/menu';
import { combineLatest, debounceTime } from 'rxjs';
import { DOCUMENT } from '@angular/common';

interface SidebarConfig {
    user: unknown;
    layout: XmDynamicLayout[];
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
    standalone: false,
})
export class XmSidebarComponent implements OnInit, AfterViewInit, OnDestroy {
    private menuService: MenuService = inject(MenuService);
    private document: Document = inject(DOCUMENT);
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

    public ngAfterViewInit(): void {
        this.observeIsMaterial3Menu();
    }

    private observeIsMaterial3Menu(): void {
        combineLatest([this.menuService.isMaterial3Menu, this.menuService.isSidenavOpen])
            .pipe(takeUntilOnDestroy(this), debounceTime(100))
            .subscribe(([isMaterial3Menu, isSidenavOpen]: [boolean, boolean]) => {
                isMaterial3Menu && isSidenavOpen && this.document.querySelector('xm-sidebar').classList.add('xm-material3-menu');
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
