import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { XmEntity } from '../../../../../xm-entity';
import { LoravnoService } from '../../shared/loravno.service';
import { CPI_EVENT_LIST, UNIT_TYPE_KEY, PRODUCTS_TYPE_KEY } from '../../loravno.constants';

@Component({
    selector: 'xm-unit-list-card',
    templateUrl: './unit-list-card.component.html',
    styleUrls: ['./unit-list-card.component.scss']
})
export class UnitListCardComponent implements OnInit, OnDestroy {

    private payPodSelection: Subscription;
    @Input() units: XmEntity[];
    predicate: any;
    reverse: boolean;
    selectedUnit: XmEntity;
    showLoader: boolean;

    constructor(private cpiService: LoravnoService,
                private eventManager: JhiEventManager) {
        this.predicate = 'id';
        this.reverse = true;
    }

    ngOnInit() {
        this.payPodSelection = this.eventManager.subscribe(CPI_EVENT_LIST.PAYPOD_UNIT_SELECTED,
            (data) => {
                if (data.selectedUnit) {
                    this.onSelectUnit(data.selectedUnit);
                }
            });
        this.load();
    }

    load() {
        this.showLoader = true;
        this.cpiService.getUnits({
            typeKey: UNIT_TYPE_KEY
        }).pipe(finalize(() => this.showLoader = false)).subscribe(resp => {
            this.units = resp.body || [];
            this.units.forEach((unit) => {
                unit.targets = unit.targets || [];
                let products, alerts;
                products = unit.targets
                    .filter(e => e.typeKey === PRODUCTS_TYPE_KEY)
                    .map(e => e.target);
                alerts = this.productsToAlerts(products);
                alerts = this.cpiService.sortByWeight(alerts);
                Object.assign(unit, {
                    alerts: alerts,
                    alert: (alerts && alerts.length) ? alerts[0] : null,
                    weight: (alerts && alerts.length && alerts[0].weight) ? alerts[0].weight : null
                });
            });
            this.eventManager.broadcast({name: CPI_EVENT_LIST.UPDATE_UNIT_LIST, units: this.units});
        }, (error) => {
            console.log(error);
        });
    }

    ngOnDestroy () {
        this.eventManager.destroy(this.payPodSelection);
    }

    onSelectUnit(unit: XmEntity): any {
        if (!(unit && unit.id)) {
            return false;
        }
        if (!this.selectedUnit) {
            this.selectedUnit = unit;
        } else {
            this.selectedUnit = this.selectedUnit.id !== unit.id ? unit : null;
        }
    }

    onChooseUnit(selectedUnit): void {
        this.eventManager.broadcast({name: CPI_EVENT_LIST.PAYPOD_UNIT_SELECTED, selectedUnit: selectedUnit});
    }

    private productsToAlerts(products) {
        const alerts = [];
        const productsArray = products || [];
        productsArray.forEach((product: any) => {
            product.data.alerts = product.data.alerts || [];
            product.data.alerts.forEach(alert => {
                alert.product = product;
                alerts.push(alert);
            });
        });
        return alerts;
    }

    onRefresh(): void {
        this.selectedUnit = null;
        this.units = null;
        this.load();
    }

    sortUnitsBy(this) {
        const By = this.predicate;
        const arr = this.units;
        const reverse = this.reverse;
        if (arr && arr.length > 0) {
            this.units = arr.sort((a: any, b: any) => {
                let x, y;
                x = (a[By] != null) ? a[By].toString().toLocaleLowerCase() : '';
                y = (b[By] != null) ? b[By].toString().toLocaleLowerCase() : '';
                if (x < y) {
                    return reverse ? -1 : 1;
                } else if (x > y) {
                    return reverse ? 1 : -1;
                } else {
                    return 0;
                }
            });
        }
    }
}
