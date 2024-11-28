import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { XmDynamicComponentRegistry, XmDynamicLayout, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmUIConfig, XmUiConfigService } from '@xm-ngx/core/config';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { filter } from 'rxjs/operators';
import { showHideTopPanel } from './top-panel.animation';
import { XmEventManager, XmEventManagerAction } from '@xm-ngx/core';
import {
    XmTopPanelAppearanceAnimationStateEnum,
    XmTopPanelAppearanceEvent,
    XmTopPanelUIConfig,
} from './top-panel.model';
import { NgStyle } from '@angular/common';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { XmDynamicComponentRecord } from '@xm-ngx/dynamic/src/loader/xm-dynamic-component-registry.service';
import { AnimationEvent } from '@angular/animations';

/**
 * # Top Panel Component
 *
 * This component is responsible for rendering the top panel layout that collapses the main content on its height.
 *
 * ## Usage
 * To make it works you need to provide the public UI configuration in format (example below):
 * ```yaml
 * topPanel:
 *     animation: // optional
 *         marginBottom: 8 // pixels, use it in case you have indent between top panel and main content to make all animation smooth
 *         duration: 250 // ms, use it in case you want to change the animation duration (component appearance and disappearance)
 *     layout:
 *         - selector: '@xm-ngx/components/list-layout'
 *           class: 'd-flex flex-column'
 *           config:
 *             layouts:
 *                 - selector: '@xm-ngx/components/text-title'
 *                   config:
 *                     title:
 *                       en: 'Test title 1'
 *                       uk: 'Тестовий заголовок 1'
 *                 - selector: '@xm-ngx/components/text-title'
 *                   config:
 *                     title:
 *                       en: 'Test title 2'
 *                       uk: 'Тестовий заголовок 2'
 *                 - selector: '@xm-ngx/components/text-title'
 *                   config:
 *                     title:
 *                       en: 'Test title 3'
 *                       uk: 'Тестовий заголовок 3'
 * ```
 *
 * Anywhere in the code you can broadcast the event to show or hide the top panel:
 * Firstly, inject the `XmEventManager` service:
 * ```typescript
 * import { XmEventManager } from '@xm-ngx/core';
 * ```
 * Then, to show the top panel call:
 * ```typescript
 * this.eventManager.broadcast({name: 'IS_TOP_PANEL', payload: {isTopPanel: true}});
 * ```
 *
 * To hide the top panel:
 * ```typescript
 * this.eventManager.broadcast({name: 'IS_TOP_PANEL', payload: {isTopPanel: false}});
 * ```
 */
@Component({
    selector: 'xm-top-panel',
    standalone: true,
    imports: [
        XmDynamicModule,
        NgStyle,
    ],
    providers: [XmDynamicComponentRegistry],
    templateUrl: './top-panel.component.html',
    styleUrl: './top-panel.component.scss',
    animations: [showHideTopPanel],
})
export class TopPanelComponent implements OnInit, OnDestroy {
    public topPanelLayout: XmDynamicLayout[];
    public animationState: XmTopPanelAppearanceAnimationStateEnum = XmTopPanelAppearanceAnimationStateEnum.HIDE;
    public config: XmTopPanelUIConfig;
    public isTopPanel: boolean;
    @ViewChild('topPanelRef') public topPanelRef: ElementRef;

    private uiConfigService: XmUiConfigService<XmUIConfig> = inject<XmUiConfigService>(XmUiConfigService);
    private eventManager: XmEventManager = inject(XmEventManager);
    private snackBar: MatSnackBar = inject(MatSnackBar);
    private snackBarRef: MatSnackBarRef<any>;
    private xmDynamicComponentRegistry: XmDynamicComponentRegistry = inject(XmDynamicComponentRegistry);

    public ngOnInit(): void {
        this.observeShowTopSnackbarEvent();
        this.observeShowTopPanelEvent();
        this.observeConfigChanges();
    }

    private observeShowTopSnackbarEvent(): void {
        this.eventManager.listenTo<XmTopPanelAppearanceEvent>('IS_TOP_PANEL_SNACKBAR')
            .pipe(takeUntilOnDestroy(this))
            .subscribe(async (event: XmEventManagerAction<XmTopPanelAppearanceEvent>) => {
                const { snackbar } = this.config || {};
                const { isShown } = event.payload || {};
                if (snackbar && isShown) {
                    const component: XmDynamicComponentRecord<any> = await this.xmDynamicComponentRegistry.find(snackbar.selector);
                    this.snackBarRef = this.snackBar.openFromComponent(component.componentType, snackbar.config);
                } else if (!isShown && this.snackBarRef) {
                    this.snackBarRef.dismiss();
                }
            });
    }

    private observeShowTopPanelEvent(): void {
        this.eventManager.listenTo<XmTopPanelAppearanceEvent>('IS_TOP_PANEL')
            .pipe(takeUntilOnDestroy(this))
            .subscribe((event: XmEventManagerAction<XmTopPanelAppearanceEvent>) => {
                const { isShown } = event.payload;
                isShown ? this.showTopPanel() : this.hideTopPanel();
            });
    }

    private observeConfigChanges(): void {
        this.uiConfigService.config$().pipe(
            takeUntilOnDestroy(this),
            filter(Boolean),
        ).subscribe((config: XmUIConfig) => {
            this.config = config.topPanel as XmTopPanelUIConfig;
            const { layout } = this.config || {};
            if (layout && !this.topPanelLayout) {
                this.topPanelLayout = layout;
            }
        });
    }

    private hideTopPanel(): void {
        this.animationState = XmTopPanelAppearanceAnimationStateEnum.HIDE;
    }

    private showTopPanel(): void {
        this.isTopPanel = true;
        setTimeout(() => this.animationState = XmTopPanelAppearanceAnimationStateEnum.SHOW, 200);
    }

    public onAnimationDone(event: AnimationEvent): void {
        const { fromState, toState, phaseName } = event || {};
        if (fromState === 'show' && toState === 'hide' && phaseName === 'done') {
            this.isTopPanel = false;
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
