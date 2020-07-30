import { Component, Input } from '@angular/core';
import { environment, IEnvironment } from '@xm-ngx/core/environment';
import { Observable } from 'rxjs';
import { filter, shareReplay } from 'rxjs/operators';
import { getServerEnvironment } from './get-current-env';

@Component({
    selector: 'xm-ribbon',
    templateUrl: './xm-ribbon.component.html',
    styleUrls: ['./xm-ribbon.component.scss'],
})
export class XmRibbonComponent {
    @Input() public environment: IEnvironment = environment;
    @Input() public config: { hidden?: boolean };

    public serverEnv$: Observable<string> = getServerEnvironment().pipe(filter((r) => Boolean(r)), shareReplay(1));
}
