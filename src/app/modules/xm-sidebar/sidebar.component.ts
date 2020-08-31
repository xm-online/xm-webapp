import { ChangeDetectionStrategy, Component } from '@angular/core';
import { XmUiConfigService } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { get } from 'lodash';

@Component({
    selector: 'xm-sidebar',
    host: {
        class: 'xm-sidebar',
    },
    styleUrls: ['./sidebar.component.scss'],
    templateUrl: './sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SidebarComponent {
    public config: { user: unknown };

    constructor(
        private xmConfigService: XmUiConfigService<{sidebar: { user: unknown }}>,
    ) {
    }

    public ngOnInit(): void {
        this.xmConfigService.config$().pipe(takeUntilOnDestroy(this)).subscribe(
            (config) => this.config = get(config, 'sidebar'),
        );
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
