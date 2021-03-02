import { Component, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Translate } from '@xm-ngx/translation';

@Component({
    selector: 'xm-no-data, no-data',
    templateUrl: './no-data.component.html',
    styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent {
    @Input() public imageUrl: string | SafeUrl;
    @Input() public show: boolean;
    @Input() public text: Translate;
    @Input() public hideImage: boolean = false;
}
