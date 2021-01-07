import { Color, LineTrailParticle, randomInt } from './line-trail-particle';


function randomValue(value: number | [number, number]): number {
    if (Array.isArray(value) && value.length === 2) {
        return randomInt(value[0], value[1]);
    } else {
        return value as number;
    }
}

export interface LineTrailParticlesOptions {
    liveTime: number | [number, number],
    size: number | [number, number],
    count: number | [number, number],
    color: Color,
    canvasWidth: number,
    canvasHeight: number,
    trailCount: number | [number, number],
    trailDelay: number | [number, number],
    speed: number | [number, number],
}

export class ParticlesObject {
    public objects: LineTrailParticle[] = [];

    constructor(public options: LineTrailParticlesOptions) {
    }
}

export class ParticlesLiveTimeScript {

    constructor(
        private particlesObject: ParticlesObject,
    ) {
    }

    public update(): void {
        const objects = this.particlesObject.objects;
        this.particlesObject.objects = objects.filter((lineAggregator) => {
            const line = lineAggregator.particleObject;
            return line.time < line.options.liveTime;
        });
    }

}

export class ParticlesCountScript {

    constructor(
        private ctx: CanvasRenderingContext2D,
        private particlesObject: ParticlesObject,
    ) {
    }

    public update(): void {
        const objects = this.particlesObject.objects;
        const options = this.particlesObject.options;

        const addLines = (randomValue(options.count) - objects.length);
        for (let i = 0; i < addLines; i++) {
            const line = this.createLine(options);
            objects.push(line);
        }
    }

    public createLine(options: LineTrailParticlesOptions): LineTrailParticle {
        return new LineTrailParticle(this.ctx, {
            trailCount: randomValue(options.trailCount),
            color: options.color,
            speed: randomValue(options.speed),
            trailDelay: randomValue(options.trailDelay),
            liveTime: randomValue(options.liveTime),
            size: randomValue(options.size),
            phaseTime: 500,
            phaseTimeExtraRandomCoefficient: 500,
            x: (1 - Math.tanh(Math.PI * Math.random())) * options.canvasWidth,
            y: Math.random() * options.canvasHeight,
        });
    }
}

export class DestroyParticlesOutBorderScript {
    constructor(
        private particlesObject: ParticlesObject,
    ) {
    }

    public update(): void {
        const objects = this.particlesObject.objects;
        const options = this.particlesObject.options;

        objects.map((lineAggregator) => {
            const line = lineAggregator.particleObject;

            if (line.x < 0
                || line.x > options.canvasWidth
                || line.y < 0
                || line.y > options.canvasHeight) {

                line.time = line.time * 1.01;
            }
        });
    }
}

export class LineTrailParticles {

    private readonly particlesObject: ParticlesObject;
    private readonly particlesCount: ParticlesCountScript;
    private readonly destroyParticlesOutBorder: DestroyParticlesOutBorderScript;
    private readonly particlesLiveTimeScript: ParticlesLiveTimeScript;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private options: LineTrailParticlesOptions,
    ) {
        this.particlesObject = new ParticlesObject(options);
        this.particlesCount = new ParticlesCountScript(this.ctx, this.particlesObject);
        this.destroyParticlesOutBorder = new DestroyParticlesOutBorderScript(this.particlesObject);
        this.particlesLiveTimeScript = new ParticlesLiveTimeScript(this.particlesObject);
    }

    public updateOptions(options: Partial<LineTrailParticlesOptions>): void {
        if (options.canvasHeight) {
            this.options.canvasHeight = options.canvasHeight;
        }
        if (options.canvasWidth) {
            this.options.canvasWidth = options.canvasWidth;
        }
    }

    public update(): void {
        this.particlesObject.objects.map((line) => {
            line.update();
        });

        this.particlesCount.update();
        this.destroyParticlesOutBorder.update();
        this.particlesLiveTimeScript.update();
    }
}
