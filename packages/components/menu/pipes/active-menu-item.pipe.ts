import {inject, Pipe, PipeTransform} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Observable, filter, map} from 'rxjs';
import {MenuItem} from '../menu.interface';

@Pipe({
    standalone: true,
    name: 'activeMenuItem',
})
export class ActiveMenuItemPipe implements PipeTransform {

    private router: Router = inject(Router);

    public transform(node: MenuItem): Observable<boolean> {
        const patterns = node.activeItemPathPatterns || [];
        return this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(event => event as NavigationEnd),
            map((event) => patterns.some(pattern => new RegExp(pattern).test(event.urlAfterRedirects)))
        );
    }
}
