import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XmConfigService } from '../../shared/spec/config.service';
import { Principal } from '../../shared/auth/principal.service';

export interface IHomePageOptions {
    icon?: string;
    iconColor?: string;
    message?: string;
}

@Component({
    selector: 'xm-home-default',
    templateUrl: './home-default.component.html',
    styleUrls: ['./home-default.component.scss'],
})
export class HomeDefaultComponent implements OnInit {

    public homePageOptions: IHomePageOptions;

    constructor(private xmConfigService: XmConfigService,
                private router: Router,
                private principal: Principal) {
    }

    public ngOnInit(): void {
        if (!this.principal.isAuthenticated()) {
            this.router.navigate([''], {replaceUrl: true});
        } else {
            this.xmConfigService.getUiConfig().subscribe((config) => {
                this.homePageOptions = config && config.homePage;
            });
        }
    }
}
