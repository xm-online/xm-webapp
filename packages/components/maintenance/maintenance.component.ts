import { Component, inject, Injector, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { XmDynamicComponentRegistry } from '@xm-ngx/dynamic';
import { NotFoundException } from '@xm-ngx/exceptions';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { LanguageService } from '@xm-ngx/translation';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { MaintenanceMode, MaintenanceService } from './maintenance.service';

@Component({
    selector: 'xm-maintenance-view',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.scss'],
    standalone: false,
})
export class MaintenanceComponent implements OnInit, OnDestroy {

    public isMaintenanceProgress$: Observable<boolean>;
    public maintenanceMode$: Signal<MaintenanceMode>;
    public componentInjector = inject(Injector);
    public componentInRegistry: boolean = null;
    protected readonly SELECTOR = 'xm-general/maintenance';
    private registry = inject(XmDynamicComponentRegistry);

    constructor(
        private maintenanceService: MaintenanceService,
        private languageService: LanguageService,
    ) {
        this.maintenanceMode$ = toSignal(this.maintenanceService.maintenanceMode$());
        this.isMaintenanceProgress$ = this.maintenanceService.maintenance$().pipe(
            takeUntilOnDestroy(this),
        );

        this.isMaintenanceProgress$.pipe(
            first(it => it === true),
        ).subscribe(() => {
            this.languageService.refresh();
        });
    }

    public async ngOnInit(): Promise<void> {
        try {
            const component = await this.registry.find(this.SELECTOR, this.componentInjector);
            this.componentInRegistry = !!component;
        } catch (e) {
            if (e instanceof NotFoundException) {
                this.componentInRegistry = false;
            } else {
                // eslint-disable-next-line no-console
                console.error(e);
            }
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
