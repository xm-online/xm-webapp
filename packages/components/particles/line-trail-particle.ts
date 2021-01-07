import { clone } from 'lodash';

export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export type Color = { r: number, g: number, b: number, a: number }

export interface LineTrailParticleOptions {
    /** Start X position. */
    x: number;
    /** Start Y position. */
    y: number;
    /** Length of the trail. */
    trailCount: number;
    /** Distance per ticks. */
    speed: number,
    /** Distance between trails in ticks. */
    trailDelay: number,
    color: Color,
    /** Moving one direction in ticks. */
    phaseTime: number,
    /** Extend live time. */
    phaseTimeExtraRandomCoefficient: number,
    size: number,
    liveTime: number,
}

export class LineTrailParticleObject {
    public time: number = 0;
    public x: number = this.options.x;
    public y: number = this.options.y;
    public color: Color = clone(this.options.color);
    public speed: number = this.options.speed;

    constructor(public options: LineTrailParticleOptions) {
    }
}

export class LiveTimeColorScript {
    constructor(
        private particleObject: LineTrailParticleObject) {
    }

    public update(): void {
        const ratio = this.particleObject.time / this.particleObject.options.liveTime;
        this.particleObject.color.a = 1 - Math.pow(ratio, 3);
    }
}

export class LineTrailParticleScript {

    private history: { x: number, y: number }[] = [];
    private trailDelayTime: number = 0;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private particleObject: LineTrailParticleObject) {
    }

    public update(): void {
        for (let i = 0; i < this.history.length; i++) {
            const ratio = Math.tan((Math.PI / 2) * (i / this.history.length) / 2);
            const opacity = ratio * this.particleObject.color.a;
            this.drawCircle(this.history[i].x, this.history[i].y, opacity);
        }

        if (this.trailDelayTime >= this.particleObject.options.trailDelay) {
            this.storeLastPosition(this.particleObject.x, this.particleObject.y);
            this.trailDelayTime = 0;
        } else {
            ++this.trailDelayTime;
        }
    }

    private storeLastPosition(x: number, y: number): void {
        this.history.push({ x, y });

        if (this.history.length > this.particleObject.options.trailCount) {
            this.history.shift();
        }
    }

    private drawCircle(x: number, y: number, r: number): void {
        const options = this.particleObject.options;
        this.ctx.beginPath();
        this.ctx.arc(x, y, options.size, 0, 2 * Math.PI, true);
        this.ctx.fillStyle = `rgba(${options.color.r}, ${options.color.g}, ${options.color.b}, ${r})`;
        this.ctx.fill();
    }
}

export class LinePhaseParticleScript {
    private phase: { nextPhaseTime: number, rad: number, addedX: number, addedY: number };
    private timer: number = 0;

    constructor(
        private particleObject: LineTrailParticleObject) {
        this.createPhase();
    }

    public update(): void {
        this.calculateNextPosition();

        if (this.timer >= this.phase.nextPhaseTime) {
            this.createPhase();
        } else {
            ++this.timer;
        }
    }

    private calculateNextPosition(): void {
        const speed = this.particleObject.speed;
        const x = this.phase.addedX * speed;
        const y = this.phase.addedY * speed;
        this.particleObject.x += x;
        this.particleObject.y += y;
    }

    private createPhase(): void {
        this.timer = 0;
        const nextPhaseTime = (this.particleObject.options.phaseTime + this.particleObject.options.phaseTimeExtraRandomCoefficient * Math.random()) | 0;

        const step = Math.PI * 2 / 6;
        const rad = step * randomInt(0, 6);
        const addedX = Math.sin(rad);
        const addedY = Math.cos(rad);

        this.phase = {
            nextPhaseTime,
            addedX,
            addedY,
            rad,
        };
    }
}

export class LineTrailParticle {

    public particleObject: LineTrailParticleObject;
    public lineTrailParticleScript: LineTrailParticleScript;
    public linePhaseParticle: LinePhaseParticleScript;
    public liveTimeColorScript: LiveTimeColorScript;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private options: LineTrailParticleOptions,
    ) {
        this.particleObject = new LineTrailParticleObject(this.options);
        this.lineTrailParticleScript = new LineTrailParticleScript(this.ctx, this.particleObject);
        this.linePhaseParticle = new LinePhaseParticleScript(this.particleObject);
        this.liveTimeColorScript = new LiveTimeColorScript(this.particleObject);
    }

    public update(): void {
        this.liveTimeColorScript.update();
        this.lineTrailParticleScript.update();
        this.drawCircle(this.particleObject.x, this.particleObject.y);
        this.linePhaseParticle.update();
        ++this.particleObject.time;
    }

    private drawCircle(x: number, y: number): void {
        const color = this.particleObject.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.options.size, 0, 2 * Math.PI, true);
        this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        this.ctx.fill();
    }
}
