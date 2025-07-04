import { Component, EventEmitter, Input, Output } from '@angular/core';
import { flattenObj } from '../services/helpers';

@Component({
    selector: 'xm-keys-view',
    templateUrl: './keys-view.component.html',
    styleUrls: ['./keys-view.component.scss'],
    standalone: false,
})
export class KeysViewComponent {
    public translationKeys: [string, string][] = [];
    public filterTranslationKeys: [string, string][] = [];
    public rawJson: {} = {};
    public unSave: { [key: string]: string } = {};
    @Input() public editable: boolean = false;
    public filters: { byValue: string; byKey: string } = {
        byKey: '',
        byValue: '',
    };
    @Output() public updateTranslate: EventEmitter<{ key: string; value: string }> = new EventEmitter();
    @Output() public deleteTranslate: EventEmitter<string> = new EventEmitter();

    @Input() set json(json: {}) {
        if (!json) {
            return;
        }

        this.rawJson = json;
        this.translationKeys = Object.entries(flattenObj(json));
        this.resetState();
    }

    public changeTranslate(key: string): void {
        this.updateTranslate.emit({key, value: this.unSave[key]});

        delete this.unSave[key];
    }

    public changeInput(key: string, value: string): void {
        this.unSave[key] = value;
    }


    public saveAll(): void {
        Object.entries(this.unSave).forEach(([key, value]) => {
            this.updateTranslate.emit({key, value});
        });

        this.unSave = {};
    }

    public delete(value: string): void {
        this.deleteTranslate.emit(value);
    }

    public resetInput(key: string): void {
        delete this.unSave[key];
    }

    public changeFilter(): void {
        this.filterTranslationKeys = this.translationKeys
            .filter(([key]) => key.includes(this.filters.byKey))
            .filter(([key, translate]) => translate.includes(this.filters.byValue));
    }

    private resetState(): void {
        this.unSave = {};
        this.changeFilter();
    }
}
