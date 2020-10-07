import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { StringHandler, StringProcessing } from './string-processing';

@Directive({
    selector: '[xmStringHandler]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => StringHandlerDirective),
        multi: true,
    }],
})
export class StringHandlerDirective extends NgModelWrapper<string> {

    @Input('xmStringHandler') public handlers: StringHandler[];

    constructor(
        protected elementRef: ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) {
        super();
    }

    public proceed(value: string): string {
        return StringProcessing.handleAll(this.handlers)(value);
    }

    @HostListener('focusout')
    public applyHandlers(): void {
        const value = this.elementRef.nativeElement.value;
        if (value) {
            this.elementRef.nativeElement.value = this.proceed(value);
        }
        this.change(this.elementRef.nativeElement.value);
    }


    @HostListener('input')
    public inputValue(): void {
        this.change(this.elementRef.nativeElement.value);
    }

    @HostListener('blur')
    public applyFocusOut(): void {
        this.touche(this.elementRef.nativeElement.value);
    }

    public writeValue(obj: string): void {
        this.elementRef.nativeElement.value = obj;
        super.writeValue(obj);
    }

}
