import {
    ComponentRef,
    Directive,
    Input,
    OnChanges,
    Optional,
    Renderer2,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
    selector: `button[mat-button][loading],
               button[mat-raised-button][loading],
               button[mat-icon-button][loading],
               button[mat-fab][loading],
               button[mat-mini-fab][loading],
               button[mat-stroked-button][loading],
               button[mat-flat-button][loading]`,
    host: {
        class: 'xm-button-spinner',
    },
    standalone: true,
})
export class ButtonSpinnerDirective implements OnChanges {
    private spinner: ComponentRef<MatProgressSpinner>;

    @Input() public loading: boolean;
    @Input() public disabled: boolean;
    @Input() public color: ThemePalette;
    @Input() public height: number;

    constructor(
       @Optional() private matButton: MatButton,
       @Optional() private matIconButton: MatIconButton,
        private viewContainerRef: ViewContainerRef,
        private renderer: Renderer2,
    ) {
        this.matButton = this.matButton || this.matIconButton;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!changes.hasOwnProperty('loading')) {
            return;
        }

        if (changes.loading.currentValue) {
            this.matButton._elementRef.nativeElement.classList.add('xm-button-spinner-loading');
            this.matButton.disabled = true;
            this.createSpinner();
        } else if (!changes.loading.firstChange) {
            this.matButton._elementRef.nativeElement.classList.remove('xm-button-spinner-loading');
            this.matButton.disabled = this.disabled;
            this.destroySpinner();
        }
    }

    private createSpinner(): void {
        if (!this.spinner) {
            this.spinner = this.viewContainerRef.createComponent(MatProgressSpinner);
            this.spinner.instance.color = this.color;
            this.spinner.instance.diameter = this.height || 20;
            this.spinner.instance.mode = 'indeterminate';
            this.renderer.appendChild(this.matButton._elementRef.nativeElement, this.spinner.instance._elementRef.nativeElement);
        }
    }

    private destroySpinner(): void {
        if (this.spinner) {
            this.spinner.destroy();
            this.spinner = null;
        }
    }
}
