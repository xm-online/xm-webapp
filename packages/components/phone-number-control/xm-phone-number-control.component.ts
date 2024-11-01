import { Component, Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { assign } from 'lodash';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskModule } from 'ngx-mask';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface XmPhoneNumberControlOptions {
    hint?: HintText;
    id: string;
    title: Translate;
    defaultPrefix: string;
    pattern: string;
    mask: string;
    required: boolean;
    placeHolderCharacter: string;
    search?: boolean;
    searchOnEnter?: boolean;
    activeIconColor?: string;
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
    search: false,
};

@Directive({
    selector: '[onPasteRemovePrefix]',
    standalone: true,
})
export class OnPasteRemovePrefixDirective {

    @Input()
    public onPasteRemovePrefixPrefix: string;

    public constructor(private elementRef: ElementRef<HTMLInputElement>) {
    }

    @HostListener('paste', ['$event'])
    public onPaste(event: ClipboardEvent): void {
        const clipboardData = event.clipboardData;
        let pastedText: string = clipboardData.getData('text') || '';
        if (pastedText.startsWith(this.onPasteRemovePrefixPrefix))
            pastedText = pastedText.slice(this.onPasteRemovePrefixPrefix.length);
        this.elementRef.nativeElement.value = pastedText;
    }
}


@Component({
    selector: 'xm-phone-number-control',
    templateUrl: './xm-phone-number-control.component.html',
    standalone: true,
    imports: [
        OnPasteRemovePrefixDirective,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        NgxMaskModule,
        ControlErrorModule,
        XmTranslationModule,
        ReactiveFormsModule,
        FormsModule,
        HintModule,
        MatButtonModule,
        MatIconModule,
    ],
})
export class XmPhoneNumberControlComponent extends NgControlAccessor<string> {
    @Output() public search: EventEmitter<string> = new EventEmitter<string>();
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

    public onSearch(): void {
        if (this.ngControl?.invalid) {
            return;
        }
        this.search.emit(this.config?.defaultPrefix + this.inputValue);
    }
}
