import { ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, ElementRef, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { XmTranslationModule } from '@xm-ngx/translation';
import { PageCollectionFactory } from '@xm-ngx/ext/entity-webapp-ext/module/page-entity-widget/api/page-collection-factory.service';
import { IEntityCollection } from '@xm-ngx/components/entity-collection';
import { Observable, catchError, debounceTime, distinctUntilChanged, finalize, from, fromEvent, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { format, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { get } from 'lodash';
import { IId } from '@xm-ngx/shared/interfaces';

export interface SearchPatternToken {
    type: 'single' | 'pair' | 'text';
    startPos: number;
    endPos: number;
    value: string;
}

export type SearchPatternBackendToken = IId;

export interface SearchPatternSearchResult {
    searchedToken: string;
    token: SearchPatternToken;
}

export interface TextSearchPatternControlConfig {
    title?: string;
    resourceUrl: string;
    queryTemplate?: string;
    searchPath?: string;
}

@Component({
    standalone: true,
    selector: 'text-search-pattern-control',
    imports: [
        CommonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        XmTranslationModule,
        XmLoadingModule,
    ],
    template: `
        <mat-form-field [xm-loading]="loading">
            <mat-label *ngIf="config?.title">{{ config.title | translate }}</mat-label>

            <textarea
                matInput
                cdkTextareaAutosize
                cdkAutosizeMinRows="1"
                cdkAutosizeMaxRows="3"
                autocomplete="off"
                [formControl]="textControl"
                [matAutocomplete]="tokenAutocomplete"></textarea>

            <mat-autocomplete [displayWith]="displayWith" #tokenAutocomplete="matAutocomplete" [autoSelectActiveOption]="false" (optionSelected)="select($event)">
                <mat-option *ngFor="let token of autocompleteTokens" [value]="token">
                    {{token.searchedToken}}
                </mat-option>
            </mat-autocomplete>
        </mat-form-field>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextSearchPatternControlComponent extends NgModelWrapper<string> implements OnInit, OnDestroy {
    @ViewChild(MatAutocompleteTrigger) public auto: MatAutocompleteTrigger;
    @ViewChild(MatInput, { static: true, read: ElementRef }) public input: ElementRef;

    @Input() public config: TextSearchPatternControlConfig;

    public ngControl = inject(NgControl);
    private cdRef = inject(ChangeDetectorRef);
    private collectionFactory = inject(PageCollectionFactory);

    private resource: IEntityCollection<unknown>;

    public textControl = new FormControl('');
    public tokens: SearchPatternToken[] = [];
    public autocompleteTokens: SearchPatternSearchResult[] = [];
    public loading = false;

    constructor() {
        super();

        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    /**
     * Need this because under the hood mat-autocomplete update the "value" and also we update the "value"
     * so, it produces two events first as object (from mat-autocomplete) second as string (ours)
     */
    public displayWith = (value: object | string): string => {
        if (typeof value === 'string') {
            return value;
        }

        return '';
    };

    public ngOnInit(): void {
        this.resource = this.collectionFactory.create(this.config.resourceUrl);

        this.textControl.valueChanges.pipe(
            tap((value) => {
                this.change(value);
            }),
            takeUntilOnDestroy(this),
        ).subscribe();

        from(['input', 'mouseup', 'keyup'])
            .pipe(
                mergeMap(event => fromEvent<Event>(this.input.nativeElement, event).pipe(debounceTime(100))),
                map((evt) => {
                    const target = evt.target as HTMLInputElement;
                    const type = evt.type;

                    this.tokens = this.tokenizeText(target.value);

                    const token = this.getUserSelectionToken(this.tokens, target);

                    if (token && type === 'mouseup') {
                        target.setSelectionRange(token.startPos, token.endPos);
                    }

                    return token;
                }),
                distinctUntilChanged((prev, curr) => {
                    if (prev == null || curr == null) {
                        return false;
                    }

                    return prev.startPos == curr.startPos && prev.endPos == curr.endPos;
                }),
                switchMap((selectionToken): Observable<SearchPatternSearchResult[] | []> => {
                    if (selectionToken == null) {
                        return of([]);
                    }

                    this.loading = true;
                    this.cdRef.markForCheck();

                    return this.request(selectionToken);
                }),
                tap((autocomplete) => {
                    this.autocompleteTokens = autocomplete;

                    // If autocomplete control missing focus
                    if (this.auto.panelOpen == false && this.autocompleteTokens.length > 0) {
                        this.auto.openPanel();
                    }

                    this.cdRef.markForCheck();
                }),
                takeUntilOnDestroy(this),
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public getUserSelectionToken(tokens: SearchPatternToken[], input: HTMLInputElement): SearchPatternToken {
        return tokens
            .filter(f => f.type === 'pair' || f.type === 'single')
            .find(token => input.selectionStart >= token.startPos && input.selectionEnd <= token.endPos);
    }


    public select(evt: MatAutocompleteSelectedEvent): void {
        const { searchedToken, token } = evt.option.value as SearchPatternSearchResult;

        const value = this.untokenize();
        const replaced = value.substring(0, token.startPos) + searchedToken + value.substring(token.endPos);

        this.textControl.patchValue(replaced);

        this.cdRef.markForCheck();
    }

    public writeValue(value: string): void {
        this.textControl.patchValue(value, { emitEvent: false });
    }

    public setDisabledState(isDisabled: boolean): void {
        super.setDisabledState(isDisabled);

        isDisabled
            ? this.textControl.disable({ emitEvent: false })
            : this.textControl.enable({ emitEvent: false });

        this.cdRef.markForCheck();
    }

    private request(selectionToken: SearchPatternToken): Observable<SearchPatternSearchResult[]> {
        return this.resource.request<SearchPatternBackendToken[]>(
            'get',
            {},
            this.config?.queryTemplate ? format(this.config.queryTemplate, selectionToken) : {}
        ).pipe(
            map<SearchPatternBackendToken[], SearchPatternSearchResult[]>(response => {
                return response?.map(r => ({
                    searchedToken: get(r, this.config?.searchPath ?? 'name', null) as string | null,
                    token: selectionToken,
                }));
            }),
            catchError(() => of([{
                searchedToken: null,
                token: selectionToken,
            }])),
            finalize(() => {
                this.loading = false;
                this.cdRef.markForCheck();
            }),
        );
    }

    private tokenizeText(text: string): SearchPatternToken[] {
        const tokens: SearchPatternToken[] = [];

        let index = 0;
        let start = 0;
        let braceCount = 0;

        while (index < text.length) {
            if (text[index] === '{') {
                braceCount++;
                if (braceCount === 1) {
                    if (index > start) {
                        tokens.push({
                            type: 'text',
                            startPos: start,
                            endPos: index,
                            value: text.substring(start, index),
                        });
                    }
                    start = index + 1;
                }
            } else if (text[index] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    tokens.push({
                        type: 'pair',
                        startPos: start,
                        endPos: index,
                        value: text.substring(start, index),
                    });
                    start = index + 1;
                }
            }
            index++;
        }

        if (index > start) {
            if (braceCount > 0) {
                // Unclosed
                tokens.push({
                    type: 'single',
                    startPos: start,
                    endPos: index,
                    value: text.substring(start),
                });
            } else {
                tokens.push({
                    type: 'text',
                    startPos: start,
                    endPos: index,
                    value: text.substring(start, index),
                });
            }
        }

        return tokens;
    }

    private untokenize(): string {
        return this.tokens.map(f => {
            if (f.type === 'text') {
                return f.value;
            } else if (f.type === 'single') {
                return `{${f.value}}`;
            }

            return `{${f.value}}`;
        }).join('');
    }
}