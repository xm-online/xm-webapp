import { CommonModule } from '@angular/common';
import {
    Component,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    NgModule,
    NgModuleRef,
    OnDestroy,
    OnInit,
    TemplateRef,
    Type,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import * as _ from 'lodash';
import { Container } from './container';
import { SidebarRightConfig, SidebarRightService } from './sidebar-right.service';

@Directive({selector: '[xmContainerOutlet]'})
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

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(event: MouseEvent): void {
        if (this.mousePressedOnResizer) {
            if (event.stopPropagation) event.stopPropagation();
            if (event.preventDefault) event.preventDefault();
            const vw = window.innerWidth / 100;
            const newWidthInPx = window.innerWidth - event.x;
            const newWidth = newWidthInPx / vw;
            const min = this.minVW();
            this.width = newWidth < min ? `${min}vw` : newWidth > 95 ? '95vw' : `${newWidth}vw`;
            localStorage.setItem(this.getWidthStorageKey(), this.width);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    public onMouseUp(): void {
        this.mousePressedOnResizer = false;
    }

    @HostListener('document:mousedown', ['$event'])
    public onMouseDown(event: MouseEvent): void {
        if (this.resizerElement.nativeElement.contains(event.target)) {
            this.mousePressedOnResizer = true;
        }
    }

    private mousePressedOnResizer: boolean;

    constructor(private sidebarRightService: SidebarRightService,
                private moduleRef: NgModuleRef<unknown>,
    ) {
    }

    public ngOnInit(): void {
        this.sidebarRightService.setContainer(this as Container);
    }

    public ngOnDestroy(): void {
        this.sidebarRightService.removeContainer();
    }

    public create<T, D>(templateRef: TemplateRef<D> | Type<T>, config: SidebarRightConfig<D>): T | null {
        const viewContainerRef = this.xmContainerOutlet.viewContainerRef;
        if (viewContainerRef.length > 0) {
            viewContainerRef.clear();
        }

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
        const main: HTMLElement = document.getElementById('main');
        main.style.marginRight = width;
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
