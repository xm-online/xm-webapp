import { Component, Input } from '@angular/core';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { Translate } from '@xm-ngx/translation';
import { assign } from 'lodash';

export interface XmPhoneNumberControlOptions {
    id: string;
    title: Translate;
    defaultPrefix: string;
    pattern: string;
    mask: string;
    required: boolean;
    placeHolderCharacter: string;
}

export const XM_PHONE_NUMBER_CONTROL_OPTIONS_DEFAULT = {
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
    templateUrl: './xm-phone-number-control.component.html',
    styleUrls: ['./xm-phone-number-control.component.scss'],
})
export class XmPhoneNumberControlComponent extends NgControlAccessor<string> {
    public inputValue: string;

    private _options: XmPhoneNumberControlOptions = assign({}, XM_PHONE_NUMBER_CONTROL_OPTIONS_DEFAULT);

    public get options(): XmPhoneNumberControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmPhoneNumberControlOptions) {
        this._options = assign({}, XM_PHONE_NUMBER_CONTROL_OPTIONS_DEFAULT, value);
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
