import { Component, OnDestroy } from '@angular/core';
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
    public active: DocsExample;
    public inputValue$: Subject<string> = new Subject();
    public components$: Observable<DocsExample[]>;

    public ngOnInit(): void {
        this.components$ = combineLatest(
            this.inputValue$.pipe(startWith('')),
            of(DOC_EXAMPLES),
        ).pipe(
            map(([input, components]) => {
                return _.filter(components, (component) => component.exampleDocHtml.toLowerCase().includes(input.toLowerCase()));
            }),
            tap((components) => {
                if (!this.active) {
                    this.active = components[0];
                }
            }),
        );
    }

    public ngOnDestroy(): void {
        this.inputValue$.complete();
    }
}
