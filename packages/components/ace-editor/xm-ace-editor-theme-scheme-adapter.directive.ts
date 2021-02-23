import { Directive, Input, NgModule, OnDestroy, OnInit, Self } from '@angular/core';
import { XmAceEditorDirective } from '@xm-ngx/components/ace-editor/xm-ace-editor.directive';
import { XmThemeStore } from '@xm-ngx/core/theme';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

@Directive({
    selector: '[xmAceEditorThemeSchemeAdapter]',
})
export class XmAceEditorThemeSchemeAdapterDirective implements OnDestroy, OnInit {
    @Input() public onLightTheme: string = 'chrome';
    @Input() public onDarkTheme: string = 'tomorrow_night';

    constructor(
        @Self() private xmAceEditor: XmAceEditorDirective,
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
    exports: [XmAceEditorThemeSchemeAdapterDirective],
    declarations: [XmAceEditorThemeSchemeAdapterDirective],
})
export class XmAceEditorThemeSchemeAdapterModule {
}
