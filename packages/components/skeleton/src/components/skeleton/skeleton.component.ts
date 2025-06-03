import { ChangeDetectionStrategy, Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { XmSkeletonConfig, XmSkeletonStyles } from '@xm-ngx/dynamic/src/interfaces/xm-dynamic-layout';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'xm-skeleton',
    standalone: true,
    templateUrl: './skeleton.component.html',
    styleUrl: './skeleton.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
    private readonly DEFAULT_SKELETON_STYLES: XmSkeletonStyles = {width: '100%', height: '16px', radius: '99px'};
    private readonly DEFAULT_SKELETON_STYLES_FROM_PUBLIC_CONFIG: XmSkeletonStyles = toSignal(
        inject(XmUiConfigService).config$(),
    )()?.skeleton?.defaultStyles;

    public config: InputSignal<XmSkeletonConfig> = input<XmSkeletonConfig>(null);

    public stylesTextFormat: Signal<string> = computed(() => {
        return Object.entries(this.styles)
            .map(([key, value]: [string, string]) => `${this.mapKey(key)}: ${value};`)
            .join(' ');
    });

    private get styles(): XmSkeletonStyles {
        return this.config()?.styles ?? (this.DEFAULT_SKELETON_STYLES_FROM_PUBLIC_CONFIG || this.DEFAULT_SKELETON_STYLES);
    }

    private mapKey(key: string): string {
        switch (key) {
            case 'radius':
                return 'border-radius';
            default:
                return key;
        }
    }
}
