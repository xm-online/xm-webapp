import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { DOC_EXAMPLES, DocsExample } from './xm-doc-examples';


@Component({
    selector: 'xm-doc-examples',
    styleUrls: ['./xm-doc-examples.component.scss'],
    templateUrl: './xm-doc-examples.component.html',
})
export class XmDocExamplesComponent implements OnDestroy {
    public active: DocsExample | null = null;
    public inputValue$: Subject<string> = new Subject();
    public components$: Observable<DocsExample[]>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
    }

    public ngOnInit(): void {
        this.components$ = combineLatest(
            this.inputValue$.pipe(startWith('')),
            of(DOC_EXAMPLES),
        ).pipe(
            map(([input, components]) => {
                return _.filter(components, (component) => component.exampleDocHtml.toLowerCase().includes(input.toLowerCase()));
            }),
            tap((components) => {
                if (!components?.length) {
                    return;
                }

                if (this.active !== null) {
                    this.setActive(components[0]);
                    return;
                }

                if (this.activatedRoute.snapshot.queryParams.activeSelector) {
                    const activeSelector = this.activatedRoute.snapshot.queryParams.activeSelector;
                    const active = components.find(i => i.selector === activeSelector) || components[0];
                    this.setActive(active);
                } else {
                    this.setActive(components[0]);
                }
            }),
        );
    }

    public ngOnDestroy(): void {
        this.inputValue$.complete();
    }

    public setActive(component: DocsExample): void {
        this.active = component;
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: { activeSelector: component.selector },
                queryParamsHandling: 'merge',
            });
    }
}
