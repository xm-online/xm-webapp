import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { LoravnoService } from '../../index';
import { XmEntity } from '../../../../../xm-entity';
import { CPI_EVENT_LIST, PRODUCTS_TYPE_KEY, TYPE_LAST_EVENT, TYPE_RECOMMENDED_EVENT } from '../../loravno.constants';

declare let swal: any;

@Component({
    selector: 'xm-unit-product-list-card',
    templateUrl: './unit-product-list-card.component.html',
    styleUrls: ['./unit-product-list-card.component.scss']
})
export class UnitProductListCardComponent implements OnInit, OnDestroy {

    private payPodSelection: Subscription;
    private payPodListUpdate: Subscription;
    @Input() selectedUnit: XmEntity;
    products: XmEntity[];
    address: any;
    showLoader: boolean;

    constructor(private eventManager: JhiEventManager,
                private translateService: TranslateService,
                private cpiService: LoravnoService,
                private router: Router) {
    }

    ngOnInit() {
        this.payPodSelection = this.eventManager.subscribe(CPI_EVENT_LIST.PAYPOD_UNIT_SELECTED,
            (data) => {
                if (data.selectedUnit) {
                    this.onSelectUnit(data.selectedUnit);
                    this.getAddress(data.selectedUnit);
                }
            });
        this.payPodListUpdate = this.eventManager.subscribe(CPI_EVENT_LIST.UPDATE_UNIT_LIST,
            (data) => {
                this.selectedUnit = null;
            });
    }

    ngOnDestroy () {
        this.eventManager.destroy(this.payPodSelection);
        this.eventManager.destroy(this.payPodListUpdate);
    }

    onSelectUnit(unit: XmEntity) {
        if (!(unit && unit.id)) {
            console.log('No unit data!');
            return false;
        }
        if (!this.selectedUnit) {
            this.selectedUnit = unit;
        } else {
            this.selectedUnit = this.selectedUnit.id !== unit.id ? unit : null;
        }
        this.products = unit.targets.filter((e) => e.typeKey === PRODUCTS_TYPE_KEY) || [];
        this.products.forEach((product: any) => {
            let alerts = product.target.data.alerts || [];
            const lastEvents = this.eventsToProduct(product.target.data.calendars || [], TYPE_LAST_EVENT);
            const recommendedEvents = this.eventsToProduct(product.target.data.calendars || [], TYPE_RECOMMENDED_EVENT, true);
            alerts = this.cpiService.sortByWeight(alerts);
            Object.assign(product, {
                weight: (alerts && alerts[0] && alerts[0].weight) ? alerts[0].weight : null,
                lastMaintenance: (lastEvents && lastEvents[0]) ? lastEvents[0] : null,
                recommendedMaintenance: (recommendedEvents && recommendedEvents[0]) ? recommendedEvents[0] : null
            });
        });
        this.products = this.cpiService.sortByWeight(this.products);
    }

    private eventsToProduct(calendar: any, typeKey: string, reversed?: boolean): any {
        const eventsList = [];
        const calendarEvents = calendar || [];
        calendarEvents.forEach(item => {
            item.events.forEach(event => {
                if (event.typeKey === typeKey) {
                    eventsList.push(event);
                }
            });
        });
        eventsList.sort((a: any, b: any) => {
            if (a.startDate < b.startDate) {
                return reversed ? -1 : 1;
            }
            if (a.startDate > b.startDate) {
                return reversed ? 1 : -1;
            }
            return 0;
        });
        return eventsList;
    }

    private onFirmwareUpdate() {
        swal({
            title: this.translateService.instant('ext-cpi.swal.update-firmware'),
            showCancelButton: false,
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
        });
    }

    private onUnitNavigate(entity) {
        this.router.navigate(['/application', entity.typeKey, entity.id]);
    }

    private onProductNavigate(entity) {
        this.router.navigate(['/application', entity.target.typeKey, entity.target.id]);
    }

    private getAddress(unit) {
        this.address = null;
        if (unit && unit.locations && unit.locations.length > 0) {
            const arr = unit.locations;
            const el = arr[0];
            this.address =  el.addressLine1 ? el.addressLine1 : null;
        } else  {
            this.address = null;
        }
    }

    onRefresh(selectedItem) {
        this.showLoader = true;
        this.products = null;
        // this timeout is for pretending nice loading experience
        setTimeout(() => {
            this.products = selectedItem.targets.filter((e) => {
                return e.typeKey === PRODUCTS_TYPE_KEY;
            });
            this.showLoader = false;
        }, 1200);
    }
}
