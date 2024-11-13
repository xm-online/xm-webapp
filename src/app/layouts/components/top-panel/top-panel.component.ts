import {
    AfterViewInit,
    Component,
    ElementRef,
    inject,
    NgZone,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { XmDynamicLayout, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmUIConfig, XmUiConfigService } from '@xm-ngx/core/config';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { filter } from 'rxjs/operators';
import { showHideTopPanel } from './top-panel.animation';
import { XmEventManager, XmEventManagerAction } from '@xm-ngx/core';
import {
    XmTopPanelAppearanceAnimationStateEnum,
    XmTopPanelAppearanceEvent,
    XmTopPanelAppearanceTimings,
    XmTopPanelUIConfig,
} from './top-panel.model';
import { NgStyle } from '@angular/common';

/**
 * # Top Panel Component
 *
 * This component is responsible for rendering the top panel layout that collapses the main content on its height.
 *
 * ## Usage
 * To make it works you need to provide the public UI configuration in format (example below):
 * ```yaml
 * topPanel:
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
    templateUrl: './top-panel.component.html',
    styleUrl: './top-panel.component.scss',
    animations: [showHideTopPanel],
})
export class TopPanelComponent implements OnInit, AfterViewInit, OnDestroy {
    public topPanelLayout: XmDynamicLayout[];
    public animationState: XmTopPanelAppearanceAnimationStateEnum = XmTopPanelAppearanceAnimationStateEnum.HIDE;
    public isTopPanel: boolean = false;
    @ViewChild('topPanelRef') public topPanelRef: ElementRef;

    private readonly heightProperty = 'height';
    private readonly transformProperty = 'transform';
    private readonly overflowProperty = 'overflow';

    private uiConfigService: XmUiConfigService<XmUIConfig> = inject<XmUiConfigService>(XmUiConfigService);
    private renderer: Renderer2 = inject(Renderer2);
    private zone: NgZone = inject(NgZone);
    private eventManager: XmEventManager = inject(XmEventManager);
    private resizeObserver: ResizeObserver;

    private mainWrapperEl: HTMLElement;
    private heatMapEl: HTMLElement;

    public ngOnInit(): void {
        this.observeShowTopPanelEvent();
        this.observeConfigChanges();
    }

    public ngAfterViewInit(): void {
        this.mainWrapperEl = document.querySelector('#main-content-wrapper');
        this.observeHostElementHeightChanges();
    }

    private observeShowTopPanelEvent(): void {
        this.eventManager.listenTo<XmTopPanelAppearanceEvent>('IS_TOP_PANEL')
            .pipe(takeUntilOnDestroy(this))
            .subscribe((event: XmEventManagerAction<XmTopPanelAppearanceEvent>) => {
                const { isTopPanel } = event.payload;
                if (isTopPanel) {
                    this.isTopPanel = isTopPanel;
                } else {
                    this.hideTopPanel();
                }
            });
    }

    private observeConfigChanges(): void {
        this.uiConfigService.config$().pipe(
            takeUntilOnDestroy(this),
            filter(Boolean),
        ).subscribe((config: XmUIConfig) => {
            const { layout } = config?.topPanel as XmTopPanelUIConfig || {};
            if (layout && !this.topPanelLayout) {
                this.topPanelLayout = layout;
            }
        });
    }

    private observeHostElementHeightChanges(): void {
        this.heatMapEl = document.querySelector('xm-heatmap-container');
        this.resizeObserver = new ResizeObserver(entries => {
            this.zone.run(() => {
                const {height} = entries[0].contentRect || {};
                height > 0 && this.showTopPanel(height);
            });
        });
        this.resizeObserver.observe(this.topPanelRef.nativeElement);

        // TODO: FOR DEV PURPOSES. REMOVE IT LATER.
        // setTimeout(() => {
        //     this.eventManager.broadcast({name: 'IS_TOP_PANEL', payload: {isTopPanel: true}});
        // }, 3000);
        //
        // setTimeout(() => {
        //     this.eventManager.broadcast({name: 'IS_TOP_PANEL', payload: {isTopPanel: false}});
        // }, 20000);
    }

    private hideTopPanel(): void {
        this.animationState = XmTopPanelAppearanceAnimationStateEnum.HIDE;
        this.renderer.setStyle(this.mainWrapperEl, this.heightProperty, '100%');
        this.renderer.setStyle(this.mainWrapperEl, this.transformProperty, 'translateY(0)');

        setTimeout(() => {
            this.isTopPanel = false;
        }, XmTopPanelAppearanceTimings.DEFAULT_TRANSITION);
    }

    private showTopPanel(height: number): void {
        this.renderer.setStyle(this.heatMapEl, this.overflowProperty, 'hidden');
        this.renderer.setStyle(this.mainWrapperEl, this.transformProperty, `translateY(${height}px)`);
        this.animationState = XmTopPanelAppearanceAnimationStateEnum.SHOW;

        setTimeout(() => {
            this.renderer.setStyle(this.heatMapEl, this.overflowProperty, 'auto');
            this.renderer.setStyle(this.mainWrapperEl, this.heightProperty, `calc(100% - ${height}px`);
        }, XmTopPanelAppearanceTimings.DEFAULT_TRANSITION);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
        this.resizeObserver.unobserve(this.topPanelRef.nativeElement);
    }
}
