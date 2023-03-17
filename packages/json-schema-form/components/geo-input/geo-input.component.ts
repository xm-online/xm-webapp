import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GeoInputOptions } from './geo-input.model';
import { JsonSchemaFormService } from '@xm-ngx/json-schema-form/core';
import { LanguageService, Locale } from '@xm-ngx/translation';

declare let google: any;
export type LocaleCode = string | 'en-us' | 'ru-ru' | 'uk-ua' | 'de-de' | 'it';

@Component({
    selector: 'geo-input',
    templateUrl: './geo-input.component.html',
})
export class GeoInputComponent implements OnInit {
    public controlValue: string = '';
    public options: GeoInputOptions;
    public lang!: LocaleCode;
    @Input() public layoutNode: any;
    @ViewChild('geoInput') public geoInput: any;

    constructor(
        private jsf: JsonSchemaFormService,
        private languageService: LanguageService,
    ) {
        this.languageService.locale$.subscribe((l) => {
            this.lang = this.getLangCode(l);
        });
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }

    public onAfterGMapApiInit(): void {
        this.getPlaceAutocomplete();
    }

    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.geoInput.nativeElement, {types: this.options.predictionType || ['address']});
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.invokeEvent(place);
        });
    }

    public invokeEvent(place: any): void {
        this.jsf.updateValue(this, place?.formatted_address);
    }

    private getLangCode(l: Locale = 'en'): LocaleCode {
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
