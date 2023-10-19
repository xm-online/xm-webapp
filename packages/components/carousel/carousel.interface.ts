import { XmCarouselContentDirective } from './carousel.directive';

export type XmCarouselGesture = TouchEvent | PointerEvent;

export interface XmCarouselGestureEvent { 
    event: XmCarouselGesture;
    clientX: number;
}

export interface XmCarouselBreakpoint { 
    max: number;
    slidesCount: number;
}

export interface XmCarouselContainerMeasure { 
    offsetWidth: number;
    scrollWidth: number;
}

export interface XmCarouselAdaptiveSettings { 
    slidesCount: number;
    containerWidth: number;
    containerScroll: number;
    slideWidth: number;
    direction?: 'prev' | 'next';
    overflow: boolean;
}

export interface XmCarouselHandleButton { 
    slidesCount: number;
    offsetCount: number;
    contents: XmCarouselContentDirective[];
}

export interface XmCarouselConfig {
    swipeThreshold?: number;
    gap?: number;
    duration?: number;
    breakpoints?: XmCarouselBreakpoint[];
}
