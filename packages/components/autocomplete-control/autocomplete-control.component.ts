import { CommonModule } from '@angular/common';
import {
    Component,
    forwardRef,
    Input,
    OnInit,
    inject,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { LanguageService, Translate, XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, tap, filter, shareReplay, finalize } from 'rxjs/operators';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { EntityCollectionFactoryService } from '@xm-ngx/components/entity-collection';
import { format } from '@xm-ngx/shared/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface XmAutocompleteControlMapper {
    // Interpolated string as ${name}
    displayFn: string;
    valueByKey: string;
}

export type XmAutocompleteControlParams = Record<string, string>;
export type XmAutocompleteControlBody = Record<string, string>;

export interface XmAutocompleteControlListItem {
    value: string;
    view: string;
}

export interface XmAutocompleteControlConfig {
    hint?: HintText;
    title?: string;
    search: {
        resourceUrl: string;
        resourceMethod: string;
        queryParams: XmAutocompleteControlParams;
        body: XmAutocompleteControlBody;
        headers: Record<string, string>;
    };
    extractByKey: string;
    itemMapper: XmAutocompleteControlMapper;
    autoSelectFirst: boolean;
    searchIfEmpty: boolean;
    searchPlaceholder: Translate;
    notFoundSearchPlaceholder: Translate;
}

const AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG: XmAutocompleteControlConfig = {
    hint: null,
    title: '',
    search: {
        resourceUrl: null,
        resourceMethod: 'GET',
        queryParams: {},
        body: {},
        headers: {},
    },
    autoSelectFirst: false,
    searchIfEmpty: false,
    extractByKey: null,
    itemMapper: {
        displayFn: '${name}',
        valueByKey: '${name}',
    },
    searchPlaceholder: 'global.rest-select-placeholder-noresults',
    notFoundSearchPlaceholder: 'global.rest-select-placeholder-search.simple',
};

@Component({
    standalone: true,
    selector: 'xm-autocomplete-control',
    template: `
        <mat-form-field>
            <mat-label *ngIf="config?.title">{{ config?.title | translate }}</mat-label>

            <mat-select [disabled]="disabled"
                        [value]="value"
                        (selectionChange)="change($event.value)">
                
                <mat-option>
                    <ngx-mat-select-search [formControl]="searchQueryControl"
                                           [placeholderLabel]="config.searchPlaceholder | translate"
                                           [noEntriesFoundLabel]="config.notFoundSearchPlaceholder | translate"></ngx-mat-select-search>
                </mat-option>

                <mat-progress-bar mode="indeterminate" *ngIf="loading | async"></mat-progress-bar>

                <mat-option [hidden]="!value" (click)="deselect()">
                    <mat-icon>close</mat-icon>
                    {{'common-webapp-ext.buttons.cancel' | translate}}
                </mat-option>

                <ng-container *ngIf="(list | async)?.length > 0; then listing else selected">
                    
                </ng-container>

                <ng-template #listing>
                    <mat-option *ngFor="let s of list | async"
                                [value]="s.value">
                        {{s.view | translate}}
                    </mat-option>
                </ng-template>
                
                <ng-template #selected>
                    <mat-option *ngIf="value" [value]="value">
                        {{value}}
                    </mat-option>
                </ng-template>
            </mat-select>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        MatProgressBarModule,
        ReactiveFormsModule,
        XmTranslationModule,
        MatIconModule,
        CommonModule,
        HintModule,
    ],
    providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => XmAutocompleteControlComponent), multi: true } ],
})
export class XmAutocompleteControlComponent extends NgModelWrapper<string> implements OnInit {
    private _config: XmAutocompleteControlConfig = AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG;

    @Input()
    public set config(value: XmAutocompleteControlConfig) {
        this._config = _.defaultsDeep(value, AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG) as XmAutocompleteControlConfig;
    }
    public get config(): XmAutocompleteControlConfig {
        return this._config;
    }

    private collectionFactory = inject(EntityCollectionFactoryService);
    private languageService = inject(LanguageService);

    public searchQueryControl = new FormControl('');
    public list = of<XmAutocompleteControlListItem[]>([]);

    private _loading = new BehaviorSubject<boolean>(false);
    public get loading(): Observable<boolean> {
        return this._loading.asObservable().pipe(shareReplay(1));
    }

    public ngOnInit(): void {
        this.list = this.searchQueryControl.valueChanges.pipe(
            startWith<string>(null),
            distinctUntilChanged(),
            debounceTime(300),
            filter((value) => !_.isEmpty(value) || this.config?.searchIfEmpty),
            tap(() => this._loading.next(true)),
            switchMap((searchQuery) => {
                const locale = this.languageService.locale;
                const languages = this.languageService.languages;

                const { resourceUrl, resourceMethod, queryParams, headers, body} = this.config?.search || {};

                const httpParams: XmAutocompleteControlParams = format(queryParams, { search: searchQuery, locale, languages });
                const httpBody: XmAutocompleteControlBody = format(body, { search: searchQuery, locale, languages });

                if (resourceUrl) {
                    return this.collectionFactory.create(resourceUrl).request(
                        resourceMethod,
                        httpBody,
                        new HttpParams({
                            fromObject: httpParams,
                        }),
                        new HttpHeaders(headers),
                    ).pipe(
                        catchError(() => of([])),
                        map((data) => {
                            if (this.config?.extractByKey) {
                                return _.get(data, this.config?.extractByKey, []);
                            }
                            
                            return data;
                        }),
                        map(collection => {
                            if (!_.isEmpty(collection) && _.isArray(collection)) {
                                return collection?.map((item) => {
                                    const { displayFn, valueByKey } = format<XmAutocompleteControlMapper>(this.config?.itemMapper, {
                                        locale,
                                        languages,
                                    });

                                    return {
                                        value: _.template(valueByKey)(item as object),
                                        view: _.template(displayFn)(item as object),
                                    } as XmAutocompleteControlListItem;
                                });
                            }
                            
                            return [];
                        }),
                        finalize(() => this._loading.next(false)),
                    );
                }

                return of([]);
            }),
            tap((list) => {
                if (this.config?.autoSelectFirst) {
                    this.autoSelectSingle(list);
                }
            }),
            shareReplay(1),
        );
    }

    private autoSelectSingle(list: XmAutocompleteControlListItem[]) {
        if (list.length == 1) {
            const [first] = list;

            this.change(first.value);
        }
    }

    public deselect(): void {
        this.change('');
    }
}