import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { Translate } from '@xm-ngx/translation';
import { HintService } from '../hint.service';

export interface HintSwitchConfig {
    title: Translate;
}

export const HINT_SWITCH_CONFIG = {
    title: {
        'en': 'Show hint',
        'ru': 'Показать подсказки',
        'uk': 'Показати підказки',
        'de': 'Hinweis anzeigen',
        'it': 'Mostra suggerimento',
    },
};

@Component({
    selector: 'xm-hint-switch',
    templateUrl: './hint-switch.component.html',
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
