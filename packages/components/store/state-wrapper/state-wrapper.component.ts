import { Component, inject, Input, OnInit, Signal } from '@angular/core';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { StateWrapperService } from './state-wrapper.service';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { ConditionModule } from '@xm-ngx/components/condition';
import { get } from 'lodash';
import { AppStore } from '@xm-ngx/ngrx-store';
import { ValueFromSignalPipe } from './value-from-signal.pipe';

@Component({
    selector: 'xm-state-wrapper',
    standalone: true,
    imports: [
        AsyncPipe,
        JsonPipe,
        XmDynamicModule,
        ConditionModule,
        NgIf,
        ValueFromSignalPipe,
    ],
    templateUrl: './state-wrapper.component.html',
    styleUrl: './state-wrapper.component.scss',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateWrapperComponent<ConfigType> implements OnInit {
    @Input() public config: any;

    private readonly componentStore: StateWrapperService = inject(StateWrapperService);
    public value$ = this.componentStore.select(state => get(state, this.config.state.field));
    private appStore = inject(AppStore);
    public value: Signal<any>;

    public ngOnInit(): void {
        this.componentStore.addWidget({
            selector: this.config?.widget?.['selector'],
            data: {config: this.config, entity: null},
        });
        // this.componentStore.fetchWidgetData(this.config);
        // @ts-ignore
        this.appStore.fetch(this.config);
        this.value = this.appStore.httpRequest;
        // this.componentStore.select(state => state).subscribe(console.log);
        setTimeout(() => {
            // @ts-ignore
            this.appStore.fetch({
                ...this.config,
                httpRequest: {
                    url: 'ussd/api/v1/ussdCode/3bc3beb4-370a-4a17-a2a5-be3a67907bd8?embed=data',
                    method: 'GET',
                },
            });
        }, 2000);
    }
}
