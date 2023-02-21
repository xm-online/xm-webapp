import { Component, Input } from '@angular/core';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { Translate } from '@xm-ngx/translation';
import { assign } from 'lodash';
import { HintText } from '@xm-ngx/components/hint';

export interface XmPhoneNumberControlOptions {
    hint?: HintText;
    id: string;
    title: Translate;
    defaultPrefix: string;
    pattern: string;
    mask: string;
    required: boolean;
    placeHolderCharacter: string;
}

export const XM_PHONE_NUMBER_CONTROL_OPTIONS_DEFAULT = {
    hint: null,
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
})
export class XmPhoneNumberControlComponent extends NgControlAccessor<string> {
    public inputValue: string;

    private _config: XmPhoneNumberControlOptions = assign({}, XM_PHONE_NUMBER_CONTROL_OPTIONS_DEFAULT);

    public get config(): XmPhoneNumberControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmPhoneNumberControlOptions) {
        this._config = assign({}, XM_PHONE_NUMBER_CONTROL_OPTIONS_DEFAULT, value);
    }

    public set value(value: string) {
        this.inputValue = this.trimPrefix(value);
    }

    public writeValue(obj: string): void {
        obj = this.trimPrefix(obj);
        super.writeValue(obj);
        this.inputValue = obj;
    }

    public change(v: string): void {
        if (!v?.startsWith(this._config.defaultPrefix)) {
            v = this._config.defaultPrefix + v;
        }
        super.change(v);
    }

    private trimPrefix(value: string): string {
        if (value?.startsWith(this._config.defaultPrefix)) {
            value = value.substring(this._config.defaultPrefix.length, value.length);
        }

        return value;
    }
}
