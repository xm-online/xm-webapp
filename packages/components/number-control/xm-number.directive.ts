import { Directive, ElementRef, HostListener, Input, Pipe, PipeTransform } from '@angular/core';

export enum XmNumberSystemType {
    None = 0,
    /** 0-infinity */
    Natural = 'Natural',
    /** -infinity-infinity */
    Integer = 'Integer',
    /** -infinity.fractions-infinity.fractions */
    Rational = 'Rational'
}

function charFilter(value: string, regex: string): string {
    let res = '';
    for (let i = 0; i < value.length; i++) {
        const chr = value[i];
        if (regex.includes(chr)) {
            res += chr;
        }
    }
    return res;
}

@Pipe({
    name: 'xm-number',
})
export class XmNumberPipe implements PipeTransform {
    public transform(value: string, type: XmNumberSystemType): string {
        switch (type) {
            case XmNumberSystemType.None:
                return value ? value : value;
            case XmNumberSystemType.Natural:
                return value ? charFilter(value, '0123456789') : value;
            case XmNumberSystemType.Integer:
                return value ? charFilter(value, '0123456789-') : value;
            case XmNumberSystemType.Rational:
                return value ? charFilter(value, '0123456789-.,') : value;
            default:
                // eslint-disable-next-line @typescript-eslint/only-throw-error
                throw 'Invalid type';
        }
    }
}

@Directive({standalone: false, selector: 'input[xm-number],[xm-number]'})
export class XmNumberDirective {
    @Input('xm-number') public type: XmNumberSystemType = XmNumberSystemType.Rational;

    constructor(private elementRef: ElementRef<HTMLInputElement>) {
    }

    public get value(): string {
        return this.elementRef.nativeElement.value;
    }

    public set value(value: string) {
        this.elementRef.nativeElement.value = value;
    }

    // TODO: Do we really need all of this events
    @HostListener('input', ['$event'])
    @HostListener('keydown', ['$event'])
    @HostListener('keyup', ['$event'])
    @HostListener('mousedown', ['$event'])
    @HostListener('mouseup', ['$event'])
    @HostListener('select', ['$event'])
    @HostListener('contextmenu', ['$event'])
    @HostListener('drop', ['$event'])
    @HostListener('focusout', ['$event'])
    public onValueChange(evt: Event): void {
        const newValue = (evt.target as HTMLInputElement)?.value;
        const oldValue = this.value;

        if (!newValue) {
            return;
        }

        // We handle all events above, it's a lot of events while we're typing, so we change value if it's changed
        if (newValue === oldValue) {
            return;
        }

        this.value = new XmNumberPipe().transform(this.value, this.type);
    }
}
