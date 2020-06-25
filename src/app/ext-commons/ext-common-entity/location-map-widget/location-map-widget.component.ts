import { HttpResponse } from '@angular/common/http';
import {Component, NgZone, OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { buildMapId, buildPinSymbol } from '../../../shared/helpers/google-map-helper';
import { XmEntity, XmEntityService } from '../../../xm-entity/';
import {MarkerManager} from '@agm/core';

declare const google: any;
declare const MarkerClusterer: any;

@Component({
    selector: 'xm-location-map-widget',
    templateUrl: './location-map-widget.component.html',
    styleUrls: ['./location-map-widget.component.scss'],
})
export class LocationMapWidgetComponent implements OnInit {

    public mapId: string;
    public name: any;
    public config: any;
    public groups: any[];
    public currentGroup: any;
    public markerClusterer: any;
    public gMapApiReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private xmEntityService: XmEntityService,
                private ngZone: NgZone) {
    }

    public ngOnInit(): void {
        this.mapId = buildMapId('generalMap');
        this.name = this.config.name;
        this.groups = this.config.groups;
        this.currentGroup = this.groups[0];
        console.log('onInit', this);
        this.initMap();
    }

    public showGroup(group: any): void {
        this.currentGroup = group;
        this.initMap();
    }

    public initMap(): void {
        console.log('initMap', this);
        this.loading$.next(true);
        this.xmEntityService.search({
            query: this.currentGroup.query,
            size: this.currentGroup.size ? this.currentGroup.size : 20,
        }).subscribe(
            (res: HttpResponse<XmEntity[]>) => {
                this.gMapApiReady$
                    .pipe(
                        filter((status) => status),
                    )
                    .subscribe(() => {
                        this.loading$.next(false);
                        this.onShowMap(res.body);

                    });
            },
            () => console.warn('Error'),
        );
    }

    public onAfterGMapApiInit(): void {
        console.log('onAfterGMapApiInit', this);
        this.gMapApiReady$.next(true);
    }

    public onShowMap(data: any[]): void {
        console.log('onShowMap', this);
        if (this.markerClusterer) {
            this.markerClusterer.clearMarkers();
        }
        const mapOptions = {
            scrollwheel: false,
        };


        const bounds = new google.maps.LatLngBounds();
        const map = new google.maps.Map(document.getElementById(this.mapId), mapOptions);
        const markers = [];
        const mgr = new MarkerManager(map, this.ngZone);
        this.markerClusterer = new MarkerClusterer(map, markers, {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        });
        for (const xmEntity of data) {
            const locations: any[] = xmEntity.locations;

            locations.forEach((location, index) => {
                if ((location.latitude > -90 && location.latitude < 90)
                    && (location.longitude > -180 && location.longitude < 180)) {
                    // TODO: it should be filter by location type based on widget config
                        const loc = new google.maps.LatLng(location.latitude, location.longitude);
                        const marker = new google.maps.Marker({
                            position: loc,
                            icon: buildPinSymbol(this.currentGroup.color),
                        });

                        markers.push(marker);
                        this.markerClusterer.addMarker(marker);
                        mgr.addMarker(marker);
                        marker.setMap(map);
                        bounds.extend(loc);

                        // const infowindow = new google.maps.InfoWindow({
                        //     content: xmEntity.name,
                        // });
                        // marker.addListener('click', () => infowindow.open(map, marker));

                }
            })
        }
        // map.fitBounds(bounds);
        map.panToBounds(bounds);
        console.log('showMap End');
    }

}
