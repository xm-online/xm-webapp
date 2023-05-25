import { Injectable, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { XmLogger } from '@xm-ngx/logger';
import { interval } from 'rxjs';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';

@Injectable({ providedIn: 'root' })
export class XmUpdateService implements OnDestroy {
    constructor(
        private swUpdate: SwUpdate,
        private xmLogger: XmLogger,
    ) {
    }

    public init(): void {
        if (!this.swUpdate.isEnabled) {
            return;
        }

        this.swUpdate.versionUpdates.subscribe((v) => {
            if (v.type === 'NO_NEW_VERSION_DETECTED') {
                return;
            }

            if (v.type === 'VERSION_INSTALLATION_FAILED') {
                return;
            }

            if (v.type === 'VERSION_READY') {
                this.xmLogger.info(`Updating to new version=${v.latestVersion.hash}`);
                this.swUpdate.activateUpdate().then(() => document.location.reload());
                return;
            }

            if (v.type === 'VERSION_DETECTED') {
                this.xmLogger.info(`Loading and updating to new version=${v.version.hash}`);
                this.swUpdate.activateUpdate().then(() => document.location.reload());
            }
        });

        interval(60 * 60 * 1000)
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => this.swUpdate.checkForUpdate().then());

        this.swUpdate.checkForUpdate().then();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
