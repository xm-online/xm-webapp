import { Component, ElementRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { MatButtonModule } from '@angular/material/button';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { MenuService } from '@xm-ngx/components/menu';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';

@Component({
    selector: 'xm-navbar-toggle-widget',
    imports: [
        MatButtonModule,
        XmPermissionModule,
    ],
    standalone: true,
    template: `
        <button *xmIfSession
                (click)="sidebarToggle()"
                class="navbar-toggler btn btn-icon btn-just-icon btn-link btn-no-ripple"
                mat-icon-button
                type="button">
            <span class="visually-hidden">Toggle navigation</span>
            <div class="nav-icon">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </button>
    `,
    styleUrls: ['./xm-navbar-toggle-widget.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class XmNavbarToggleWidget implements OnInit, OnDestroy, XmDynamicWidget {
    @Input() public config: unknown;

    protected mobileMenuVisible: boolean = false;

    constructor(
        private element: ElementRef,
        private menuService: MenuService,
    ) {
    }

    public ngOnInit(): void {
        this.sidebarOpen();
        this.observeSidenavOpenedState();
    }

    private observeSidenavOpenedState(): void {
        this.menuService.sidenavOpenedChange
            .pipe(takeUntilOnDestroy(this))
            .subscribe((isOpen: boolean) => isOpen ? this.sidebarOpen() : this.sidebarClose());
    }

    public async sidebarToggle(): Promise<void> {
        await this.menuService.sidenav.toggle();
    }

    // TODO: refactor
    public sidebarOpen(): void {
        const navbar: HTMLElement = this.element.nativeElement;
        const toggleButton = navbar.getElementsByClassName('navbar-toggler')[0] as HTMLElement;
        if (!toggleButton) {
            return;
        }
        const $toggle = document.getElementsByClassName('navbar-toggler')[0];
        const body = document.getElementsByTagName('body')[0];
        setTimeout(() => {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');
        setTimeout(() => {
            $toggle.classList.add('toggled');
        }, 430);

        const $layer = document.createElement('div');
        $layer.setAttribute('class', 'close-layer');

        if (body.querySelectorAll('.main-panel')) {
            document.getElementsByClassName('main-panel')[0].appendChild($layer);
        } else if (body.classList.contains('off-canvas-sidebar')) {
            document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
        }

        setTimeout(() => {
            $layer.classList.add('visible');
        }, 100);

        $layer.onclick = (() => {
            body.classList.remove('nav-open');
            this.mobileMenuVisible = false;

            $layer.classList.remove('visible');
            setTimeout(() => {
                $layer.remove();
                $toggle.classList.remove('toggled');
            }, 400);
        }).bind(this);

        body.classList.add('nav-open');
        this.mobileMenuVisible = true;
    }

    // TODO: refactor
    public sidebarClose(): void {
        const navbar: HTMLElement = this.element.nativeElement;
        const toggleButton = navbar.getElementsByClassName('navbar-toggler')[0] as HTMLElement;
        if (!toggleButton) {
            return;
        }
        const $toggle = document.getElementsByClassName('navbar-toggler')[0];
        const body = document.getElementsByTagName('body')[0];
        toggleButton.classList.remove('toggled');
        const $layer = document.createElement('div');
        $layer.setAttribute('class', 'close-layer');

        body.classList.remove('nav-open');
        if ($layer) {
            $layer.remove();
        }

        setTimeout(() => {
            $toggle.classList.remove('toggled');
        }, 400);

        this.mobileMenuVisible = false;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
