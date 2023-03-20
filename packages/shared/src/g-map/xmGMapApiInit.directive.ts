import {
    Directive,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { XmConfigService } from '@xm-ngx/core/config';
import { LanguageService, Locale } from '@xm-ngx/translation';

declare global {
    interface Window {google: { maps: any }}
}
type LocaleCode = string | 'en-us' | 'ru-ru' | 'uk-ua' | 'de-de' | 'it';
interface IGoogleApiCfg {
    libraries?: string[];
}
@Directive({
    selector: '[xmGMapApiInit]',
})

export class XmGMapApiInitDirective implements OnInit, OnDestroy {
    @Output() public gMapApiReady: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public libraries: string[] = ['geometry'];
    public lang!: LocaleCode;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private statusLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private xmConfigService: XmConfigService,
        private languageService: LanguageService,
    ) {
        this.languageService.locale$.subscribe((l) => {
            this.lang = this.getMamLangCode(l);
        });
    }

    public ngOnInit(): void {
        if (window.google && window.google.maps) {
            this.statusLoaded.next(true);
        } else {
            this.xmConfigService
                .getConfigJson('/webapp/settings-public.yml?toJson&processed=true')
                .pipe(
                    tap((publicConfig) => this.loadGoogleMapApi(publicConfig?.apiKey, publicConfig?.googleApiConfig)),
                    takeUntil(this.destroyed$),
                ).subscribe();
        }

        this.statusLoaded.pipe(
            tap((status) => this.updateView(status)),
            takeUntil(this.destroyed$),
        ).subscribe();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private updateView(status: boolean): void {
        this.viewContainerRef.clear();

        if (status) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
            this.statusLoaded.complete();
            this.gMapApiReady.emit(status);
        }
    }

    private loadGoogleMapApi(apiKey: string, config?: IGoogleApiCfg): void {
        const apiKeyValue = apiKey || '';
        const scriptNode = document.createElement('script');
        const apiLibraries = this.getLibrariesParam(config);
        const language = this.lang ? `&language=${this.lang}` : '';
        scriptNode.src = `https://maps.googleapis.com/maps/api/js?key=${apiKeyValue}${apiLibraries}${language}`;
        scriptNode.onload = (): void => this.statusLoaded.next(true);

        document.getElementsByTagName('head')[0].appendChild(scriptNode);
    }

    private getLibrariesParam(config?: IGoogleApiCfg): string {
        const libs = config?.libraries || this.libraries;
        return libs.length ? `&libraries=${libs}` : '';
    }

    private getMamLangCode(l: Locale = 'en'): LocaleCode {
        switch (l) {
            case 'en': {
                return `${l}-us`;
            }
            case 'uk': {
                return `${l}-ua`;
            }
            default: {
                return `${l}-${l}`;
            }
        }
    }
}
