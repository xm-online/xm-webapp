import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { FunctionService, XmEntity } from '../../../../../xm-entity';
import { LoravnoService } from '../../shared/loravno.service';
import { CPI_EVENT_LIST, PRODUCTS_TYPE_KEY } from '../../loravno.constants';

declare const google: any;

interface CpiMarker {
    id: number,
    iconUrl: string,
    isOpen: boolean,
    alert: any,
    zIndex: number,
    unitId: number
}

interface ZoomOptions {
    maxZoom: number,
    zoomIn: number,
    zoomOut: number
}

@Component({
    selector: 'xm-unit-product-map-card',
    templateUrl: './unit-product-map-card.component.html',
    styleUrls: ['./unit-product-map-card.component.scss']
})
export class UnitProductMapCardComponent implements OnInit, OnDestroy {

    private payPodSelection: Subscription;
    private payPodListUpdate: Subscription;
    @Input() selectedUnit: XmEntity;
    @Input() units: XmEntity[];
    name: any;
    config: any = {};
    markers: CpiMarker[];
    bounds: any;
    lat: any;
    lng: any;
    zoomOptions: ZoomOptions;
    maxZoom: number;
    zoom: number;
    map: any;

    constructor(private cpiService: LoravnoService,
                private functionService: FunctionService,
                private eventManager: JhiEventManager) {
        this.zoomOptions = {
            maxZoom: 8,
            zoomIn: 12,
            zoomOut: 6
        };
        this.zoom = this.zoomOptions.zoomOut;
        this.maxZoom = this.zoomOptions.maxZoom;
    }

    ngOnInit() {
        this.payPodSelection = this.eventManager.subscribe(CPI_EVENT_LIST.PAYPOD_UNIT_SELECTED,
            (data) => {
                if (data.initFrom === 'map') {
                    return false;
                }
                if (this.selectedUnit && data.selectedUnit.id === this.selectedUnit.id) {
                    this.selectedUnit = null;
                    this.resetMap();
                } else {
                    this.selectedUnit = data.selectedUnit;
                    this.focusSelected(this.selectedUnit);
                }
            });
        this.payPodListUpdate = this.eventManager.subscribe(CPI_EVENT_LIST.UPDATE_UNIT_LIST,
            (data) => {
                this.units = data.units;
                this.selectedUnit = null;
                this.resetMap();
            });
    }

    ngOnDestroy () {
        this.eventManager.destroy(this.payPodSelection);
        this.eventManager.destroy(this.payPodListUpdate);
    }

    mapReady(map) {
        this.map = map;
    }

    focusSelected(selectedUnit?: XmEntity) {
        if (selectedUnit.locations && selectedUnit.locations.length > 0) {
            this.agmInit(this.units);
            this.markers.forEach(e => {
                if (e.id === selectedUnit.locations[0].id) {
                    this.zoom = this.zoomOptions.zoomIn;
                    this.bounds = this.generateBounds(selectedUnit.locations);
                    this.lat = (this.bounds.northeast.latitude + this.bounds.southwest.latitude) / 2;
                    this.lng = (this.bounds.northeast.longitude + this.bounds.southwest.longitude) / 2;
                    // this timeout needed for sequence purpose and zoom in action
                    setTimeout(() => {
                        e.isOpen = e.id === selectedUnit.locations[0].id;
                        e.zIndex = e.id === selectedUnit.locations[0].id ? this.markers.length  + 1 : 0;
                    }, 400);
                }
            });
        } else {
            this.resetMap();
        }
    }

    agmInit(units) {
        this.markers = [];
        units.forEach(unit => {
            const locations = unit.locations || [];
            locations.forEach(location => {
                let alerts = this.getMarkerAlerts(unit);
                    alerts = this.cpiService.sortByWeight(alerts);
                location.unitId = unit.id;
                location.zIndex = 0;
                location.isOpen = false;
                location.alert = (alerts && alerts.length && alerts[0]) ? alerts[0] : null;
                location.iconUrl = this.processIconUrl(unit.alert);
                this.markers.push(location);
            });
        });
        if (this.markers && this.markers.length > 0) {
            this.bounds = this.generateBounds(this.markers);
            this.lat = (this.bounds.northeast.latitude + this.bounds.southwest.latitude) / 2;
            this.lng = (this.bounds.northeast.longitude + this.bounds.southwest.longitude) / 2;
        }
    }

    resetMap() {
        this.agmInit(this.units);
        // this timeout needed for sequence purpose and zoom out action
        setTimeout(() => { this.zoom = this.zoomOptions.zoomOut }, 100);
    }

    generateBounds(markers): any {
        if (markers && markers.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            markers.forEach((marker: any) => {
                bounds.extend(new google.maps.LatLng({ lat: marker.latitude, lng: marker.longitude }));
            });
            if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
                const extendPoint = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
                bounds.extend(extendPoint);
            }
            return {
                northeast: {
                    latitude: bounds.getNorthEast().lat(),
                    longitude: bounds.getNorthEast().lng()
                },
                southwest: {
                    latitude: bounds.getSouthWest().lat(),
                    longitude: bounds.getSouthWest().lng()
                }
            }
        }
        return {};
    }

    private processIconUrl(alert) {
        const alertWeight = (alert && alert.weight) ? alert.weight : '1';
        return `./assets/img/map/cpi/pin-${alertWeight}.svg`;
    }

    private onMarkerChoose(marker) {
        this.units.forEach(e => {
            if (e.id === marker.xmEntity) {
                this.selectedUnit = e;
            }
        });
        this.eventManager.broadcast({ name: CPI_EVENT_LIST.PAYPOD_UNIT_SELECTED, selectedUnit: this.selectedUnit, initFrom: 'map' });
    }

    private getMarkerAlerts(unit) {
        const preparedAlerts = [];
        const products = unit.targets.filter(e => e.typeKey === PRODUCTS_TYPE_KEY) || [];
        products.forEach(product => {
            let alerts = product.target.data.alerts || [];
            alerts = this.cpiService.sortByWeight(alerts);
            if (alerts.length > 0) {
                preparedAlerts.push(alerts[0]);
            }
        });
        return preparedAlerts;
    }
}
