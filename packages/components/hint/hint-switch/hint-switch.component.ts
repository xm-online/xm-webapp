import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HintService } from '@xm-ngx/components/hint';
import * as _ from 'lodash';
import { Translate } from '@xm-ngx/translation';

export interface HintSwitchConfig {
    title: Translate;
}

export const HINT_SWITCH_CONFIG = {
    title: {
        'en': 'Show hint',
        'ru': 'Показать подсказки',
        'uk': 'Показати підказки',
    },
};

@Component({
    selector: 'xm-hint-switch',
    templateUrl: './hint-switch.component.html',
    styleUrls: [ './hint-switch.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintSwitchComponent {

    private _config: HintSwitchConfig = _.cloneDeep(HINT_SWITCH_CONFIG);

    public get config(): HintSwitchConfig {
        return this._config;
    }

    @Input()
    public set config(value: HintSwitchConfig) {
        this._config = _.defaultsDeep(value, HINT_SWITCH_CONFIG);
    }

    constructor(
        public hintService: HintService,
    ) {
    }
}
