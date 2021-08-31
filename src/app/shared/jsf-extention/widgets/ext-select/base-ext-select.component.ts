import { JsonSchemaFormService } from '@ajsf/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { ExtSelectOptions } from '@xm-ngx/json-scheme-form';
import { ExtSelectService, URL_TEMPLATE_LITERAL } from './ext-select-service';

export default abstract class BaseExtSelectComponent {

    public abstract readonly options: ExtSelectOptions;
    public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public cacheOptionsUrl: string | null;

    protected readonly _onDestroy: Subject<void> = new Subject<void>();
    protected abstract controlValue: unknown;
    protected abstract readonly dataIndex: number[];

    protected abstract getJsf(): JsonSchemaFormService;
    protected abstract getParentJsf(): JsonSchemaFormService;
    protected abstract fetchData(options: ExtSelectOptions): void;

    protected fetchByLiteral(): void {
        const savedLiteralsValue = {};
        this.disabled$.next(true);

        this.options.url
            .match(URL_TEMPLATE_LITERAL)
            .map((literal) => {
                savedLiteralsValue[literal] = null;
                return literal;
            })
            .map((result) => result.replace(/@{|}/g, ''))
            .forEach((eLiteral) => {
                let currentFieldName: string;

                of(eLiteral).pipe(
                    filter((fieldLiteral) => !!fieldLiteral),
                    tap((fieldName) => currentFieldName = fieldName),
                    mergeMap((fieldName) => ExtSelectService.controlByKey(fieldName, this.getParentJsf().formGroup, this.dataIndex).valueChanges),
                    tap(() => this.disabled$.next(true)),
                    filter((fieldValue) => !!fieldValue),
                    tap((fieldValue) => savedLiteralsValue[`@{${currentFieldName}}`] = fieldValue),
                    map(() => savedLiteralsValue),
                    filter((literalsValue) => Object.values(literalsValue).findIndex((val) => !val) === -1),
                    tap(() => this.disabled$.next(false)),
                    map((literalsValue) => {
                        let optionsUrl = this.options.url;
                        Object.keys(literalsValue)
                            .forEach((literal) => optionsUrl = optionsUrl.replace(literal, literalsValue[literal]));
                        return optionsUrl;
                    }),
                    filter((optionsUrl) => optionsUrl !== this.cacheOptionsUrl),
                    tap((optionsUrl) => this.cacheOptionsUrl = optionsUrl),
                    map((optionsUrl: string) => {
                        const cloneOptions = Object.assign({}, this.options);
                        cloneOptions.url = optionsUrl;
                        return cloneOptions;
                    }),
                    tap((options) => this.fetchData(options)),
                    tap(() => this.getJsf().updateValue(this, this.controlValue)),
                    takeUntil(this._onDestroy),
                ).subscribe();
            });
    }
}
