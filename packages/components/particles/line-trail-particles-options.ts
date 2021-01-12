import { Color } from '@xm-ngx/components/particles/line-trail-particle';

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
