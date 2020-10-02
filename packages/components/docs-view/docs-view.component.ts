import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, shareReplay, startWith, tap } from 'rxjs/operators';

interface DocsComponent {
    name: string;
    html: string;
}

@Component({
    selector: 'xm-docs-view',
    templateUrl: './docs-view.component.html',
    styleUrls: ['./docs-view.component.scss'],
})
export class DocsViewComponent implements OnInit {

    public active: DocsComponent;
    public inputValue$: Subject<string> = new Subject();
    public components$: Observable<DocsComponent[]>;

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public ngOnInit(): void {
        const docs = this.httpClient.get<DocsComponent[]>('/docs/structure.json').pipe(
            shareReplay(1),
        );

        this.components$ = combineLatest(
            this.inputValue$.pipe(startWith('')),
            docs,
        ).pipe(
            map(([input, components]) => {
                return _.filter(components, (component) => component.html.toLowerCase().includes(input.toLowerCase()));
            }),
            tap((components) => {
                if (!this.active) {
                    this.active = components[0];
                }
            }),
        );
    }

}
