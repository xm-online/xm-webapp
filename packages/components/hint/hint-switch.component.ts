import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { HintService } from './hint.service';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
    standalone: true,
    imports: [
        CommonModule,
        MatSlideToggleModule,
        XmTranslationModule,
    ],
    template: `
        <mat-slide-toggle 
            [checked]="hintService.changes() | async"
            (toggleChange)="hintService.toggle()">
            {{config?.title | translate}}
        </mat-slide-toggle>
    `,
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
