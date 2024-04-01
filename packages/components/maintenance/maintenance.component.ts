import { Component, inject, Injector, OnDestroy, OnInit, Signal } from '@angular/core';
import { MaintenanceMode, MaintenanceService } from './maintenance.service';
import { XmDynamicComponentRegistry } from '@xm-ngx/dynamic';
import { NotFoundException } from '@xm-ngx/exceptions';
import { toSignal } from '@angular/core/rxjs-interop';
import { LanguageService } from '@xm-ngx/translation';
import { Observable } from 'rxjs';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { first } from 'rxjs/operators';

@Component({
    selector: 'xm-maintenance-view',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent implements OnInit, OnDestroy {

    protected readonly SELECTOR = 'xm-general/maintenance';

    public isMaintenanceProgress$: Observable<boolean>;
    public maintenanceMode$: Signal<MaintenanceMode>;

    public componentInjector = inject(Injector);
    private registry = inject(XmDynamicComponentRegistry);

    public componentInRegistry: boolean = null;

    constructor(
        private maintenanceService: MaintenanceService,
        private languageService: LanguageService,
    ) {
        this.maintenanceMode$ = toSignal(this.maintenanceService.maintenanceMode$());
        this.isMaintenanceProgress$ = this.maintenanceService.maintenance$().pipe(
            takeUntilOnDestroy(this),
        );

        this.isMaintenanceProgress$.pipe(
            first(it => it === true)
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
