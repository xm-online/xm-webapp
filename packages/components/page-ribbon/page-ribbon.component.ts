import { Component, OnDestroy, OnInit } from '@angular/core';
import { XmEventManager } from '@xm-ngx/core';
import { SUPER_ADMIN } from '@xm-ngx/core/auth';
import { Principal } from '@xm-ngx/core/user';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ProfileInfo } from '@xm-ngx/components/page-ribbon/profiles';
import { ProfileService } from '@xm-ngx/components/page-ribbon/profiles';
import { XmApplicationConfigService, XmUIConfig } from '@xm-ngx/core/config';
import { XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';

const XM_SUCCESS_AUTH = 'authenticationSuccess';

export interface PageRibbonXmUIConfig extends XmUIConfig {
    ribbon: boolean;
}

@Component({
    selector: 'xm-page-ribbon',
    template: `
        <div class="ribbon" *ngIf="ribbonEnv || roleKey">
            <a href="" *ngIf="ribbonEnv; else basicRibbon">{{'global.ribbon.' + ribbonEnv | translate}}</a>
            <ng-template #basicRibbon>
                <a href="">{{roleKey}}</a>
            </ng-template>
        </div>`,
    styleUrls: ['page-ribbon.scss'],
    imports:[XmTranslationModule, CommonModule],
    standalone: true,
    providers: [ProfileService],
})
export class PageRibbonComponent implements OnInit, OnDestroy {

    public profileInfo: ProfileInfo;
    public ribbonEnv: string;
    private eventAuthSubscriber: Subscription;
    public showRibbon: boolean;
    public roleKey: string;

    constructor(
        private principal: Principal,
        private profileService: ProfileService,
        private eventManager: XmEventManager,
        private xmConfigService: XmApplicationConfigService<PageRibbonXmUIConfig>,
    ) {
        const config = this.xmConfigService.getAppConfig();
        this.showRibbon = config?.ribbon;
        this.registerChangeAuth();
    }

    public ngOnInit(): void {

        this.principal.hasAnyAuthority([SUPER_ADMIN, 'ROLE_ADMIN'])
            .then((value) => {
                if (value && (this.showRibbon === undefined || this.showRibbon !== false)) {

                    this.principal.identity().then((role) => {
                        this.roleKey = role.roleKey;
                    });

                    this.principal.getAuthenticationState().pipe(take(1)).subscribe((state) => {

                        if (!state) {
                            this.roleKey = null;
                        }
                        if (state) {
                            this.principal.identity()
                                .then(() => {
                                    this.profileService.getProfileInfo().subscribe((profileInfo) => {
                                        this.profileInfo = profileInfo;
                                        this.ribbonEnv = profileInfo.ribbonEnv;
                                    });
                                });
                        }
                    });
                }
            })
            .catch((error) => console.info('PageRibbonComponent %o', error));
    }

    public ngOnDestroy(): void {
        if (this.ribbonEnv || this.showRibbon) {
            this.roleKey = null;
            this.eventManager.destroy(this.eventAuthSubscriber);
        }
    }

    private registerChangeAuth(): void {
        if (this.ribbonEnv || this.showRibbon) {
            this.eventAuthSubscriber = this.eventManager
                .subscribe(XM_SUCCESS_AUTH, () => this.ngOnInit());
        }
    }
}
