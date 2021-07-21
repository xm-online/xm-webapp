import {
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
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
})
export class ButtonSpinnerDirective implements OnChanges {
    private readonly spinnerFactory: ComponentFactory<MatProgressSpinner>;
    private spinner: ComponentRef<MatProgressSpinner>;

    @Input() public loading: boolean;
    @Input() public disabled: boolean;
    @Input() public color: ThemePalette;
    @Input() public height: number;

    constructor(
        private matButton: MatButton,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef,
        private renderer: Renderer2,
    ) {
        this.spinnerFactory = this.componentFactoryResolver.resolveComponentFactory(MatProgressSpinner);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!changes.loading) {
            return;
        }

        if (changes.loading.currentValue) {
            this.matButton._elementRef.nativeElement.classList.add('mat-loading');
            this.matButton.disabled = true;
            this.createSpinner();
        } else if (!changes.loading.firstChange) {
            this.matButton.disabled = this.disabled;
            this.destroySpinner();
        }
    }

    private createSpinner(): void {
        if (!this.spinner) {
            this.spinner = this.viewContainerRef.createComponent(this.spinnerFactory);
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
