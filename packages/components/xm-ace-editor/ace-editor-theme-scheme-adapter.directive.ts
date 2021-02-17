import { Directive, Input, NgModule, OnDestroy, OnInit, Self } from '@angular/core';
import { AceEditorDirective } from '@xm-ngx/components/xm-ace-editor/ace-editor.directive';
import { XmThemeStore } from '@xm-ngx/core/theme';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

@Directive({
    selector: '[AceEditorThemeSchemeAdapter]',
})
export class AceEditorThemeSchemeAdapterDirective implements OnDestroy, OnInit {
    @Input() public onLightTheme: string = 'chrome';
    @Input() public onDarkTheme: string = 'tomorrow_night';

    constructor(
        @Self() private xmAceEditor: AceEditorDirective,
        private themeStore: XmThemeStore,
    ) {
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public ngOnInit(): void {
        this.themeStore.activeThemeSchemeChange$()
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
