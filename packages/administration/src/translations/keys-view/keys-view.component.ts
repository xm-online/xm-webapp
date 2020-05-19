import { Component, EventEmitter, Input, Output } from '@angular/core';
import { flatten } from '../services/helpers';

@Component({
    selector: 'xm-keys-view',
    templateUrl: './keys-view.component.html',
    styleUrls: ['./keys-view.component.scss'],
})
export class KeysViewComponent {
    public translationKeys: [string, string][];
    public filterTranslationKeys: [string, string][];
    public rawJson: {};
    public unSave: {[key: string]: string} = {};

    public filters: { byValue: string; byKey: string } = {
        byKey: '',
        byValue: '',
    };

    @Input() set json(json: {}) {
        if (!json) {
            return;
        }

        this.rawJson = json;
        this.translationKeys = Object.entries(flatten(json));
        this.unSave = {};
    }

    @Output() public updateTranslate: EventEmitter<{key: string; value: string}> = new EventEmitter();

    public changeTranslate(key: string): void {
        this.updateTranslate.emit({key, value: this.unSave[key]});

        delete this.unSave[key];
    }

    public changeInput(key: string, value: any): void {
        this.unSave[key] = value;
    }

    public saveAll(): void {
        Object.entries(this.unSave).forEach(([key, value]) => {
            this.updateTranslate.emit({key, value})
        });

        this.unSave = {};
    }

    public resetInput(key: string): void {
        delete this.unSave[key];
    }

    public changeFilter(strategy: 'byKey' | 'byValue'): void {
        this.filterTranslationKeys = strategy === 'byKey'
            ? this.translationKeys.filter(([key]) => key.includes(this.filters[strategy]))
            : this.translationKeys.filter(([key, translate]) => translate.includes(this.filters[strategy]))
    }
}
