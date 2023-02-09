import { Directive, Input, NgModule, OnDestroy, OnInit, Self } from '@angular/core';
import { XmAceEditorDirective } from './xm-ace-editor.directive';
import { XmThemeController } from '@xm-ngx/core/theme';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

@Directive({
    selector: '[xmAceEditorThemeSchemeAdapter]',
})
export class XmAceEditorThemeSchemeAdapterDirective implements OnDestroy, OnInit {
    @Input() public onLightTheme: string = 'chrome';
    @Input() public onDarkTheme: string = 'tomorrow_night';

    constructor(
        @Self() private xmAceEditor: XmAceEditorDirective,
        private themeStore: XmThemeController,
    ) {
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public ngOnInit(): void {
        this.themeStore.isDark$()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((isDark) => {
                this.xmAceEditor.theme = isDark ? this.onDarkTheme : this.onLightTheme;
            });
    }
}

@NgModule({
    exports: [XmAceEditorThemeSchemeAdapterDirective],
    declarations: [XmAceEditorThemeSchemeAdapterDirective],
})
export class XmAceEditorThemeSchemeAdapterModule {
}
