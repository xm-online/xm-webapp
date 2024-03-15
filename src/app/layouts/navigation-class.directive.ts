import { Directive, HostBinding } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Directive({
    selector: '[navigationClass]',
    standalone: true
})
export class NavigationClassDirective {
    private className: string;

    @HostBinding('class')
    get elementClass(): string {
        return this.className;
    }

    public set(val: string): void {
        this.className = val;
    }

    constructor(
        protected router: Router,
    ) {
        this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd) {
                this.className = val.url.slice(1)
                    .replace(/[/]/g, '-')
                    .replace(/\./g, '')
                    .toLowerCase() || 'root-page';
            }
        });
    }
}
