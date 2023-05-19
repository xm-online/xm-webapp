import { AfterViewInit, Component, Injectable, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { XmCodeContainerModule, XmCodeModule } from '@xm-ngx/components/code';
import { XmTextControl } from '@xm-ngx/components/text';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    Observable,
    shareReplay,
    startWith,
    Subject,
    switchMap,
    tap
} from 'rxjs';
import { AsyncPipe, NgForOf } from '@angular/common';
import { WidgetCollection } from '@xm-ngx/administration/dashboards-config/injectors';
import { XmBoolComponent } from '@xm-ngx/components/bool';
import { MarkdownModule } from 'ngx-markdown';
import _ from 'lodash';
import { DashboardWidget } from '@xm-ngx/dashboard';
import { XmLoadingModule } from '@xm-ngx/components/loading';

function findMatches(arr, searchText) {
    if (searchText == '') {
        return [];
    }

    const matches = [];
    const regex = new RegExp(searchText);

    function searchInArray(item, parent, path) {
        if (matches.length > 20) {
            return;
        }

        if ((typeof item === 'string'
                || typeof item === 'number'
                || typeof item === 'boolean'
                || typeof item === 'bigint')
            && String(item).match(regex)) {
            matches.push({ path: path, value: JSON.stringify(parent, null, 2) });
        } else if (Array.isArray(item)) {
            item.forEach((value, index) => {
                const tryName = value.name ? `name:${value.name}` : '';
                const tryId = value.id ? `id:${value.id}` : '';
                const tryField = value.field ? `field:${value.field}` : '';
                const info = _.compact([tryName, tryId, tryField]).join(' ');
                const tryInfo = info ? `{${info}}` : '';
                searchInArray(value, item, `${path}[${index}${tryInfo}]`);
            });
        } else if (typeof item === 'object' && item !== null) {
            Object.entries(item).forEach(([key, value]) => {
                if (typeof key === 'string' && key.match(regex)) {
                    matches.push({ path: path, value: JSON.stringify(parent, null, 2) });
                    return;
                }
                searchInArray(value, item, `${path}.${key}`);
            });
        }
    }

    searchInArray(arr, arr, '');
    return matches;
}


@Injectable({ providedIn: 'root' })
export class WidgetCollectionStore extends WidgetCollection {
    private widgetsConfigStateUpdate = new Subject<void>();

    public widgetsConfig$: Observable<DashboardWidget[]> = this.widgetsConfigStateUpdate.pipe(
        startWith(null),
        switchMap(() => this.getAll()),
        shareReplay(1));

    public dispatch(): void {
        this.widgetsConfigStateUpdate.next(null);
    }
}

@Component({
    selector: 'xm-widget-config-examples',
    template: `
        <xm-text-control [formControl]="formControl"
                         [xm-loading]="loading"
                         [config]="{ title: 'Text' }"></xm-text-control>
        <ng-container *ngFor="let i of searchResult$ | async">
            <span>{{i.path}}</span>
            <div [innerHTML]="i.value | language : 'json' | markdown"></div>
        </ng-container>
    `,
    imports: [
        XmCodeModule,
        XmTextControl,
        ReactiveFormsModule,
        AsyncPipe,
        NgForOf,
        XmBoolComponent,
        XmCodeContainerModule,
        MarkdownModule,
        XmLoadingModule,
    ],
    standalone: true,
})
export class WidgetConfigExamplesComponent implements AfterViewInit {
    @Input() public value: string;
    public formControl: FormControl<string> = new FormControl();
    public loading = false;

    public searchResult$: Observable<{ value: string, path: string }[]> = this.formControl
        .valueChanges.pipe(
            tap(() => this.loading = true),
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(search => this.widgetCollectionStore.widgetsConfig$.pipe(
                map(data => ({ search, data })),
            )),
            map(p => {
                const result = findMatches(p.data, p.search);
                return result;
            }),
            tap(() => this.loading = false, () => this.loading = false,),
        );

    constructor(
        private widgetCollectionStore: WidgetCollectionStore,
    ) {
    }

    public ngAfterViewInit(): void {
        this.formControl.setValue(this.value);
    }
}
