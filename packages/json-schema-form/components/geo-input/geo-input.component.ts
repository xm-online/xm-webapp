import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { GeoInputOptions } from './geo-input.model';
import { JsonSchemaFormService } from '@ajsf/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { translate } from '@angular/localize/tools';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmGMapApiInitDirective } from '@xm-ngx/components/google-maps';

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
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, XmTranslationModule, XmGMapApiInitDirective],
    selector: 'geo-input',
    templateUrl: './geo-input.component.html',
})
export class GeoInputComponent implements AfterViewInit, OnDestroy {
    public controlValue!: string;
    public modelValue: string = '';
    public options: GeoInputOptions;
    public apiReady: BehaviorSubject<{ gMapReady: boolean, viewReady: boolean }> = new BehaviorSubject<{
        gMapReady: boolean;
        viewReady: boolean
    }>(null);
    @Input() public layoutNode: any;
    @ViewChild('geoInput') public geoInput: any;
    protected destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

    constructor(
        private jsf: JsonSchemaFormService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        this.apiReady.pipe(takeUntil(this.destroyed$)).subscribe((state) => {
            if (state?.gMapReady && state?.gMapReady) {
                requestAnimationFrame(() => {
                    this.initGeoinput();
                });
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngAfterViewInit(): void {
        this.options = this.layoutNode?.options || {};
        this.jsf.initializeControl(this);
        this.apiReady.next({
            ...this.apiReady.value,
            viewReady: true,
        });
    }

    public onAfterGMapApiInit(): void {
        this.apiReady.next({
            ...this.apiReady.value,
            gMapReady: true,
        });
    }

    public initGeoinput(): void {
        if (this.controlValue) {
            const dataValue: IPlaceValue = JSON.parse(this.controlValue);
            this.modelValue = dataValue?.formatted_address;
            this.changeDetectorRef.detectChanges();
        }
        this.getPlaceAutocomplete();
    }

    public invokeEvent(place: any): void {
        this.modelValue = place?.formatted_address;
        const updatedValue = this.cookValue(place);
        this.jsf.updateValue(this, updatedValue);
    }

    private getPlaceAutocomplete() {
        const types = this.options?.predictionType || ['address'];
        const autocomplete = new google.maps.places.Autocomplete(this.geoInput?.nativeElement, { types });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.invokeEvent(place);
        });
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

    protected readonly translate = translate;
}
