import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { LineTrailParticlesOptions } from '@xm-ngx/components/particles/line-trail-particles-options';
import { LineTrailParticles } from '../line-trail-particles';


export interface CanvasWithParticlesOptions {
    lineTrailOptions: LineTrailParticlesOptions
}

@Component({
    selector: 'xm-canvas-with-particles',
    templateUrl: './canvas-with-particles.component.html',
    styleUrls: ['./canvas-with-particles.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasWithParticlesComponent implements OnInit, OnDestroy {

    @Input() public options: CanvasWithParticlesOptions;

    @ViewChild('signInCanvas', { static: true }) public signInCanvas: ElementRef<HTMLCanvasElement>;
    private updateUI: boolean = true;
    private lineTrailParticles: LineTrailParticles;

    constructor(private ngZone: NgZone) {
    }

    public ngOnInit(): void {
        const canvas = this.signInCanvas.nativeElement;
        const canvasWidth = canvas.width = window.innerWidth;
        const canvasHeight = canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        const lineTrailParticles = this.lineTrailParticles = new LineTrailParticles(ctx, {
            ...this.options?.lineTrailOptions,
            canvasHeight,
            canvasWidth,
        });

        this.ngZone.runOutsideAngular(() => {
            window.requestAnimationFrame(() => {
                const updateView = () => {
                    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                    lineTrailParticles.update();
                    if (this.updateUI) {
                        window.requestAnimationFrame(() => updateView());
                    }
                };

                updateView();
            });
        });
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
}


