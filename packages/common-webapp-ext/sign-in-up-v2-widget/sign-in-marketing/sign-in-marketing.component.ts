import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingConfig } from '../sign-in-up-v2.model';

@Component({
    selector: 'xm-sign-in-marketing',
    templateUrl: './sign-in-marketing.component.html',
    styleUrls: ['./sign-in-marketing.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
    ],
})
export class SignInMarketingComponent {
    @Input() public config: MarketingConfig;
    @Input() public borderRadius: string;

}


