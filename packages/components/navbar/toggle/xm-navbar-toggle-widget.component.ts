import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { MatButtonModule } from '@angular/material/button';
import { XmPermissionModule } from '@xm-ngx/core/permission';

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
            <div id="nav-icon">
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

export class XmNavbarToggleWidget implements OnInit, XmDynamicWidget {
    @Input() public config: unknown;

    protected mobileMenuVisible: boolean = false;
    private sidebarVisible: boolean;

    constructor(
        private element: ElementRef,
    ) {
        this.sidebarVisible = false;
    }

    public ngOnInit(): void {
        this.sidebarOpen();
    }

    public sidebarToggle(): void {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
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
            this.sidebarVisible = false;

            $layer.classList.remove('visible');
            setTimeout(() => {
                $layer.remove();
                $toggle.classList.remove('toggled');
            }, 400);
        }).bind(this);

        body.classList.add('nav-open');
        this.mobileMenuVisible = true;
        this.sidebarVisible = true;
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

        this.sidebarVisible = false;
        body.classList.remove('nav-open');
        if ($layer) {
            $layer.remove();
        }

        setTimeout(() => {
            $toggle.classList.remove('toggled');
        }, 400);

        this.mobileMenuVisible = false;
    }

}
