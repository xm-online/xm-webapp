import { Component, Input } from '@angular/core';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { Translate } from '@xm-ngx/translation';
import { assign } from 'lodash';

interface PhoneNumberControlOptions {
    id: string;
    title: Translate;
    defaultPrefix: string;
    pattern: string;
    mask: string;
    required: boolean;
    placeHolderCharacter: string;
}

const DEFAULT = {
    id: 'phoneNumber',
    title: 'components.xm-phone-number-control.phone-number-label',
    defaultPrefix: '38',
    pattern: '\\d+',
    mask: '(000)-000-00-00',
    required: true,
    placeHolderCharacter: '_',
};

@Component({
    selector: 'xm-phone-number-control',
    templateUrl: './phone-number-control.component.html',
    styleUrls: ['./phone-number-control.component.scss'],
})
export class PhoneNumberControlComponent extends NgControlAccessor<string> {
    public inputValue: string;

    private _options: PhoneNumberControlOptions = assign({}, DEFAULT);

    public get options(): PhoneNumberControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: PhoneNumberControlOptions) {
        this._options = assign({}, DEFAULT, value);
    }

    public writeValue(obj: string): void {
        if (obj?.startsWith(this._options.defaultPrefix)) {
            obj = obj.substring(this._options.defaultPrefix.length, obj.length);
        }
        super.writeValue(obj);
        this.inputValue = obj;
    }

    public change(v: string): void {
        if (!v?.startsWith(this._options.defaultPrefix)) {
            v = this._options.defaultPrefix + v;
        }
        super.change(v);
    }
}
