import { Component, ElementRef, HostListener, NgModule, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { LineTrailParticles, LineTrailParticlesOptions } from '../line-trail-particles';


export interface CanvasWithParticlesOptions {
    lineTrailOptions: LineTrailParticlesOptions
}

@Component({
    selector: 'xm-canvas-with-particles',
    templateUrl: './canvas-with-particles.component.html',
    styleUrls: ['./canvas-with-particles.component.scss'],
})
export class CanvasWithParticlesComponent implements OnInit, OnDestroy {

    @Input() public options: CanvasWithParticlesOptions;

    @ViewChild('signInCanvas', { static: true }) public signInCanvas: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;
    private updateUI: boolean = true;
    private lineTrailParticles: LineTrailParticles;

    public ngOnInit(): void {
        const canvas = this.signInCanvas.nativeElement;
        const canvasWidth = canvas.width = window.innerWidth;
        const canvasHeight = canvas.height = window.innerHeight;
        this.ctx = canvas.getContext('2d');

        this.lineTrailParticles = new LineTrailParticles(this.ctx, {
            ...this.options.lineTrailOptions,
            canvasHeight,
            canvasWidth,
        });

        window.requestAnimationFrame(() => this.updateView());
    }

    @HostListener('window:resize')
    public onWindowResize(): void {
        this.updateSize();
    }

    public ngOnDestroy(): void {
        this.updateUI = false;
    }

    private updateSize(): void {
        const canvas = this.signInCanvas.nativeElement;
        const canvasWidth = canvas.width = window.innerWidth;
        const canvasHeight = canvas.height = window.innerHeight;
        this.lineTrailParticles.updateOptions({
            canvasHeight,
            canvasWidth,
        });
    }

    private updateView(): void {
        this.ctx.clearRect(0, 0, this.signInCanvas.nativeElement.width, this.signInCanvas.nativeElement.height);
        this.lineTrailParticles.update();

        if (this.updateUI) {
            window.requestAnimationFrame(() => this.updateView());
        }
    }

}


@NgModule({
    exports: [CanvasWithParticlesComponent],
    declarations: [CanvasWithParticlesComponent],
})
export class CanvasWithParticlesModule {
}
