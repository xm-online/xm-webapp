import { CommonModule } from '@angular/common';
import {
    Component,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    inject,
    NgModule,
    NgModuleRef,
    OnDestroy,
    OnInit,
    TemplateRef,
    Type,
    ViewChild,
    ViewContainerRef,
    NgZone,
} from '@angular/core';
import * as _ from 'lodash';
import { Container } from './container';
import { SidebarRightConfig, SidebarRightService } from './sidebar-right.service';
import { XmEventManager } from '@xm-ngx/core';
import { XmUIConfig, XmUiConfigService } from '@xm-ngx/core/config';
import { switchMap, tap, filter, takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, of, Subject } from 'rxjs';

interface XmMainConfig extends XmUIConfig {
    sidebar?: {
        isOutsideClickHideMenu?: boolean
    }
}

enum DomEventType {
    MOUSEDOWN = 'mousedown',
    MOUSEMOVE = 'mousemove',
    MOUSEUP = 'mouseup',
}

enum ResizeConfig {
    MAX_WIDTH_VW = 95,
    VIEWPORT_UNIT_DIVISOR = 100,
    WIDTH_UNIT = 'vw',
}

@Directive({standalone: false, selector: '[xmContainerOutlet]'})
export class ContainerOutletDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}

@Component({
    selector: 'xm-sidebar-right',
    styleUrls: ['./xm-sidebar-right.component.scss'],
    host: {
        class: 'xm-sidebar-right',
    },
    template: `
        <div class="resize-divider" #resizer></div>
        <ng-container xmContainerOutlet></ng-container>
    `,
    standalone: false,
})
export class XmSidebarRightComponent implements OnInit, OnDestroy {

    @ViewChild(ContainerOutletDirective, {static: true}) public xmContainerOutlet: ContainerOutletDirective;

    @ViewChild('resizer') public resizerElement: ElementRef;

    @HostBinding('style.width') public width: string;

    @HostBinding('class.animate') get animate(): boolean {
        return !this.mousePressedOnResizer;
    }

    @HostListener('window:resize', [])
    public onResize(): void {
        if (this.xmContainerOutlet.viewContainerRef.length > 0) {
            const min = this.minVW();
            this.changeMainElementMarginBy(`${min}vw`);
            this.width = `${Math.min(95, Math.max(parseFloat(this.width), min))}vw`;
        }
    }

    public mode: string;
    private destroy$: Subject<void> = new Subject<void>();
    private mousePressedOnResizer: boolean;
    private uiConfigService: XmUiConfigService<XmMainConfig> = inject(XmUiConfigService);

    constructor(private sidebarRightService: SidebarRightService,
                private moduleRef: NgModuleRef<unknown>,
                private eventManager: XmEventManager,
                private ngZone: NgZone
    ) {
    }


    public ngOnInit(): void {
        this.sidebarRightService.setContainer(this as Container);
        this.observeClicksOutsideSidebar();
        this.initMouseResize();
    }

    private initMouseResize(): void {
        this.ngZone.runOutsideAngular(() => {
            const mousedown$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, DomEventType.MOUSEDOWN).pipe(takeUntil(this.destroy$));
            const mousemove$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, DomEventType.MOUSEMOVE).pipe(takeUntil(this.destroy$));
            const mouseup$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, DomEventType.MOUSEUP).pipe(takeUntil(this.destroy$));

            mousedown$
                .pipe(
                    filter(event => this.resizerElement.nativeElement.contains(event.target)),
                    tap(() => this.ngZone.run((): boolean => (this.mousePressedOnResizer = true))),
                    switchMap(() =>
                        mousemove$.pipe(
                            takeUntil(
                                mouseup$.pipe(
                                    tap(() => this.ngZone.run((): boolean => (this.mousePressedOnResizer = false)))
                                )
                            ),
                            tap((event: MouseEvent) => {
                                event.stopPropagation?.();
                                event.preventDefault?.();

                                const vw: number = window.innerWidth / ResizeConfig.VIEWPORT_UNIT_DIVISOR;
                                const newWidthInPx: number = window.innerWidth - event.x;
                                const newWidth: number = newWidthInPx / vw;
                                const min: number = this.minVW();
                                const clamped: number = Math.min(Math.max(newWidth, min), ResizeConfig.MAX_WIDTH_VW);

                                this.ngZone.run(() => {
                                    this.width = `${clamped}${ResizeConfig.WIDTH_UNIT}`;
                                    localStorage.setItem(this.getWidthStorageKey(), this.width);
                                });
                            })
                        )
                    )
                )
                .subscribe();
        });
    }

    private observeClicksOutsideSidebar(): void {
        this.uiConfigService.config$().pipe(
            switchMap((config: XmMainConfig) => {
                const isOutsideClickHideMenu = config?.sidebar.isOutsideClickHideMenu;
                if (!isOutsideClickHideMenu) {
                    return of(null);
                }
                return fromEvent<MouseEvent>(document, 'click').pipe(
                    filter(Boolean),
                    tap((event) => {
                        if (this.sidebarRightService.wasJustOpened()) {
                            return;
                        }

                        const clickedMenuCategories = (event.target as HTMLElement)?.closest('.menu-categories');

                        if (clickedMenuCategories) {
                            this.remove();
                        }
                    })
                );
            })
        ).subscribe();
    }


    public ngOnDestroy(): void {
        this.sidebarRightService.removeContainer();

        this.destroy$.next();
        this.destroy$.complete();
    }

    public create<T, D>(templateRef: TemplateRef<D> | Type<T>, config: SidebarRightConfig<D>): T | null {
        const viewContainerRef = this.xmContainerOutlet.viewContainerRef;
        if (viewContainerRef.length > 0) {
            viewContainerRef.clear();
        }

        this.mode = config.mode || 'side';
        this.sidebarRightService.markJustOpened();
        if (templateRef instanceof TemplateRef) {
            viewContainerRef.createEmbeddedView(templateRef);
            this.openStyles(localStorage.getItem(this.getWidthStorageKey()) || config.width || this.sidebarRightService.width);
            return null;
        }
        return this.loadComponent(templateRef, config);
    }

    public remove(): void {
        this.xmContainerOutlet.viewContainerRef.clear();
        this.closeStyles();
    }

    private loadComponent<T, D>(templateRef: Type<T>, config: SidebarRightConfig<D>): T {
        const component = this.xmContainerOutlet.viewContainerRef.createComponent<T>(templateRef, {
            injector: config.injector,
            ngModuleRef: this.moduleRef,
        });
        _.assign(component.instance, config.data);

        this.openStyles(localStorage.getItem(this.getWidthStorageKey()) || config.width);
        return component.instance;
    }

    private openStyles(width: string): void {
        const min = this.minVW();
        this.changeMainElementMarginBy(min + 'vw');

        this.width = Math.max(parseFloat(width), min) + 'vw';
    }

    private closeStyles(): void {
        this.changeMainElementMarginBy('0');
        delete this.width;
    }

    private changeMainElementMarginBy(width: string): void {
        this.eventManager.broadcast({ name: 'rightSidebarToggle', data: { mode: this.mode, width } });
    }

    private getWidthStorageKey(): string {
        return 'xm-sidebar-rigth:width';
    }

    private minVW(): number {
        const minContentWidthPx = 450;
        const minByVW = window.innerWidth * 0.3;
        const minWidthPx = Math.max(minByVW, minContentWidthPx);
        return (minWidthPx * 100 / window.innerWidth);
    }
}

@NgModule({
    declarations: [XmSidebarRightComponent, ContainerOutletDirective],
    exports: [XmSidebarRightComponent],
    imports: [CommonModule],
})
export class XmSidebarRightModule {
}
