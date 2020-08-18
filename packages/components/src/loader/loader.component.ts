import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'xm-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnDestroy {

    @Input() public className?: string;
    @Input() public noDisableParent?: boolean;
    @Input() public absolute?: boolean;
    public show: boolean;

    constructor(
        private elementRef: ElementRef<HTMLElement>,
    ) {
    }

    @Input() set showLoader(value: boolean) {
        this.show = value;
        if (!this.noDisableParent) {
            this.elementRef.nativeElement
                .parentElement.classList[value ? 'add' : 'remove']('xm-disabled');
        }
    }

    public ngOnInit(): void {
        if (this.className) {
            this.elementRef.nativeElement.className += ` ${this.className.trim()}`;
        }
    }

    public ngOnDestroy(): void {
        this.elementRef.nativeElement
            .parentElement.classList.remove('xm-disabled');
    }
}
