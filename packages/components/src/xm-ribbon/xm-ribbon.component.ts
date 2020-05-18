import { Component, Input } from '@angular/core';
import { environment, getServerEnvironment, IEnvironment } from '@xm-ngx/core/environment';

@Component({
    selector: 'xm-ribbon',
    templateUrl: './xm-ribbon.component.html',
    styleUrls: ['./xm-ribbon.component.scss'],
})
export class XmRibbonComponent {
    @Input() public environment: IEnvironment = environment;
    @Input() public config: { hidden?: boolean };

    public serverEnv: string = getServerEnvironment();
}
