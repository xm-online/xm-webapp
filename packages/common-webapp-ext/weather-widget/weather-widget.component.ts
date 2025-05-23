import { Component, Input, OnInit } from '@angular/core';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { finalize } from 'rxjs/operators';

import { WeatherService } from './weather.service';

@Component({
    selector: 'xm-weather-widget',
    templateUrl: './weather-widget.component.html',
    styleUrls: ['./weather-widget.component.scss'],
    standalone: false,
})
export class WeatherWidgetComponent implements OnInit, XmDynamicWidget {

    @Input() public config: any;
    public weather: any = {};
    public showLoader: boolean = true;

    constructor(private weatherService: WeatherService) {
    }

    public ngOnInit(): void {
        this.weatherService.get(this.config.city).pipe(finalize(() => this.showLoader = false))
            .subscribe(
                (result) => this.weather = result,
                () => this.showLoader = false,
            );
    }

}
