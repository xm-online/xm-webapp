import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    InputSignal,
    OnInit,
    Signal,
} from '@angular/core';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { ConditionModule } from '@xm-ngx/components/condition';
import { get } from 'lodash';
import { AppStore } from '@xm-ngx/ngrx-store';

@Component({
    selector: 'xm-state-wrapper',
    standalone: true,
    imports: [
        AsyncPipe,
        JsonPipe,
        XmDynamicModule,
        ConditionModule,
        NgIf,
    ],
    templateUrl: './state-wrapper.component.html',
    styleUrl: './state-wrapper.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateWrapperComponent<ConfigType> implements OnInit {
    public config: InputSignal<any> = input<any>();

    private appStore = inject<any>(AppStore);
    public value: Signal<any>;

    public ngOnInit(): void {
        this.fetchData();
        this.assignValue();
        // For testing purposes only
        this.extraRequest();
    }

    private fetchData(): void {
        if (this.config().httpRequest) {
            this.appStore.fetch(this.config());
        }
    }

    private assignValue(): void {
        this.value = computed(() => {
            const value = this.appStore.httpRequest();
            if (!value[this.config().state.key]) {
                return null;
            }
            return get(value, this.config().state.field);
        });
    }

    private extraRequest(): void {
        setTimeout(() => {
            if (this.config().httpRequest) {
                this.appStore.fetch({
                    ...this.config(),
                    httpRequest: {
                        url: 'speech-evaluation/api/v1/operators/nmunko/summaries?filterStrategy=&fromDate.greaterThan=&toDate.lessThan=&sort=creationDate%2CDESC',
                        method: 'GET',
                    },
                });
            }
        }, 5000);
    }
}
