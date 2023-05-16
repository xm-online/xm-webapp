import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { XmCodeContainerModule, XmCodeModule } from '@xm-ngx/components/code';
import { XmTextControl } from '@xm-ngx/components/text';
import { debounceTime, distinctUntilChanged, map, Observable, shareReplay, switchMap } from 'rxjs';
import { AsyncPipe, NgForOf } from '@angular/common';
import { WidgetCollection } from '@xm-ngx/administration/dashboards-config/injectors';
import { XmBoolComponent } from '@xm-ngx/components/bool';
import { MarkdownModule } from 'ngx-markdown';
import _ from 'lodash';

function findMatches(arr, searchText) {
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


@Component({
    selector: 'xm-widget-config-examples',
    template: `
        <xm-text-control [formControl]="formControl"
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
    ],
    standalone: true,
})
export class WidgetConfigExamplesComponent {
    public formControl: FormControl = new FormControl();

    private widgetsConfig$ = this
        .dashboardStore.getAll()
        .pipe(shareReplay(1));
    public searchResult$: Observable<{ value: string, path: string }[]> = this.formControl
        .valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(search => this.widgetsConfig$.pipe(
                map(data => ({ search, data }))
            )),
            map(p => {
                const result = findMatches(p.data, p.search);
                return result;
            }),
        );

    constructor(private dashboardStore: WidgetCollection) {
    }
}
