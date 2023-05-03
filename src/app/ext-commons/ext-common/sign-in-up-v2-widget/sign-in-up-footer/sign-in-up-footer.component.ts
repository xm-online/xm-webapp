import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmTranslationModule } from '@xm-ngx/translation';

@Component({
    selector: 'xm-sign-in-up-footer',
    templateUrl: './sign-in-up-footer.component.html',
    styleUrls: ['./sign-in-up-footer.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        XmTranslationModule,
    ],
})
export class SignInUpFooterComponent {
    @Input() public config: any;
}
