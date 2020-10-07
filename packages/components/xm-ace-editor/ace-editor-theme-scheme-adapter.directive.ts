import { Directive, Input, NgModule, OnDestroy, OnInit, Self } from '@angular/core';
import { AceEditorDirective } from '@xm-ngx/components/xm-ace-editor/ace-editor.directive';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { ThemeSchemeService } from '../../xm-theme/src/theme-scheme.service';

@Directive({
    selector: '[AceEditorThemeSchemeAdapter]',
})
export class AceEditorThemeSchemeAdapterDirective implements OnDestroy, OnInit {
    @Input() public onLightTheme: string = 'chrome';
    @Input() public onDarkTheme: string = 'tomorrow_night';

    constructor(
        @Self() private xmAceEditor: AceEditorDirective,
        private themeSchemeService: ThemeSchemeService,
    ) {
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public ngOnInit(): void {
        this.themeSchemeService.schemeChange$()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((scheme) => {
                this.xmAceEditor.theme = scheme.isDark ? this.onDarkTheme : this.onLightTheme;
            });
    }
}

@NgModule({
    exports: [AceEditorThemeSchemeAdapterDirective],
    declarations: [AceEditorThemeSchemeAdapterDirective],
})
export class AceEditorThemeSchemeAdapterModule {
}
