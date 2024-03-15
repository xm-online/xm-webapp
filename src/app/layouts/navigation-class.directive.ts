import { Directive, HostBinding } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import _ from 'lodash';

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
                const slug = _.words(val.url).join('-');
                this.className = slug ? `slug-${slug}` : 'root-slug';
            }
        });
    }
}
