import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GeoInputOptions } from './geo-input.model';
import { JsonSchemaFormService } from '@xm-ngx/json-schema-form/core';

declare let google: any;

interface IPlaceValue {
    formatted_address: string;
    address_components: {
        long_name: string;
        short_name: string;
        types: string[];
    }[];
    place_id: string;
    geometry: IPlaceValueGeometry
    types: string[];
    utc_offset_minutes: number
}

interface IPlaceValueGeometry {
    location: {
        lat: number;
        lng: number;
    }
}

@Component({
    selector: 'geo-input',
    templateUrl: './geo-input.component.html',
})
export class GeoInputComponent implements OnInit {
    public controlValue!: string;
    public modelValue: string = '';
    public options: GeoInputOptions;

    @Input() public layoutNode: any;
    @ViewChild('geoInput') public geoInput: any;

    constructor(
        private jsf: JsonSchemaFormService,
    ) {
    }

    public ngOnInit(): void {
        this.options = this.layoutNode?.options || {};
    }

    public onAfterGMapApiInit(): void {
        this.getPlaceAutocomplete();

        this.jsf.initializeControl(this);
        if (this.controlValue) {
            const dataValue: IPlaceValue = JSON.parse(this.controlValue);
            this.modelValue = dataValue?.formatted_address;
        }
    }

    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.geoInput?.nativeElement, {types: this.options.predictionType || ['address']});
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.invokeEvent(place);
        });
    }

    public invokeEvent(place: any): void {
        this.modelValue = place?.formatted_address;
        const updatedValue = this.cookValue(place);
        this.jsf.updateValue(this, updatedValue);
    }

    private cookValue(place: any): string {
        const cooked: IPlaceValue = {
            formatted_address: place?.formatted_address,
            address_components: place?.address_components,
            geometry: this.getGeometryData(place),
            place_id: place?.place_id,
            types: place?.types,
            utc_offset_minutes: place?.utc_offset_minutes,
        };
        return JSON.stringify(cooked);
    }

    private getGeometryData(place): IPlaceValueGeometry {
        const lat = place?.geometry?.location?.lat();
        const lng = place?.geometry?.location?.lng();
        return {
            location: {
                lat,
                lng,
            },
        };
    }
}
