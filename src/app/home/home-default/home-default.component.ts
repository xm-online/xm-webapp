import { Component, OnInit } from '@angular/core';
import { XmConfigService } from '../../shared/spec/config.service';

export interface IHOmePageOptions {
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

    public homePageOptions: IHOmePageOptions;

    constructor(private xmConfigService: XmConfigService) {
    }

    public ngOnInit(): void {
        this.xmConfigService.getUiConfig().subscribe((config) => {
            this.homePageOptions = config && config.homePage;
        });
    }
}
