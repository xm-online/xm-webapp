import { NgModule } from '@angular/core';
import { XmDynamicEntry, XmDynamicModule } from '@xm-ngx/dynamic';

export const XM_COMPONENTS_ENTRIES: XmDynamicEntry[] = [
    {
        selector: 'copy',
        loadChildren: () => import('@xm-ngx/components/copy').then(m => m.XmCopyIconModule),
    },
    {
        selector: 'bool',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/bool` instead */
        selector: 'xm-bool-view',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolModule),
    },
    {
        selector: 'bool-control',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolControlModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/bool-control` instead */
        selector: 'xm-bool-control',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolControlModule),
    },
    {
        selector: 'checkbox-control',
        loadChildren: () => import('@xm-ngx/components/bool/checkbox-control').then(m => m.XmCheckboxControlModule),
    },
    {
        selector: 'sidebar-logo',
        loadChildren: () => import('@xm-ngx/components/logo').then(m => m.XmLogoModule),
    },
    {
        selector: 'array-control',
        loadChildren: () => import('@xm-ngx/components/array-control').then(m => m.XmArrayControlModule),
    },
    {
        selector: 'xm-angular-editor-control',
        loadChildren: () => import('@xm-ngx/components/angular-editor-control').then(m => m.AngularEditorControlModule),
    },
    {
        selector: 'sidebar-image-logo',
        loadChildren: () => import('@xm-ngx/components/logo').then(m => m.ImageLogoModule),
    },
    {
        selector: 'sidebar-menu',
        loadChildren: () => import('@xm-ngx/components/menu').then(m => m.XmMenuModule),
    },
    {
        selector: 'breadcrumb',
        loadChildren: () => import('@xm-ngx/components/breadcrumb').then(m => m.XmBreadcrumbModule),
    },
    {
        selector: 'navbar-user-widget',
        loadChildren: () => import('@xm-ngx/components/navbar-user-widget').then(m => m.NavbarUserWidgetModule),
    },
    {
        selector: 'navbar-heatmap-widget',
        loadChildren: () => import('@xm-ngx/components/navbar-heatmap-widget').then(m => m.NavbarHeatmapWidgetModule),
    },
    {
        selector: 'feedback',
        loadChildren: () => import('@xm-ngx/components/feedback').then(m => m.FeedbackModule),
    },
    {
        selector: 'switch-theme-widget',
        loadChildren: () => import('@xm-ngx/components/switch-theme-widget').then(m => m.SwitchThemeWidgetModule),
    },
    {
        selector: 'xm-ribbon',
        loadChildren: () => import('@xm-ngx/components/ribbon').then(m => m.XmRibbonModule),
    },
    {
        selector: 'mat-fab',
        loadChildren: () => import('@xm-ngx/components/mat-fab').then(m => m.MatFabModule),
    },
    {
        selector: 'file-control',
        loadChildren: () => import('@xm-ngx/components/file').then(m => m.FileControlModule),
    },
    {
        selector: 'currency-value',
        loadChildren: () => import('@xm-ngx/components/currency').then(m => m.XmCurrencyValueModule),
    },
    {
        selector: 'links-group-widget',
        loadChildren: () => import('@xm-ngx/components/links-group-widget').then(m => m.LinksGroupWidgetModule),
    },
    {
        selector: 'links-group-button-widget',
        loadChildren: () => import('@xm-ngx/components/links-group-widget').then(m => m.LinksGroupButtonWidgetModule),
    },
    {
        selector: 'by-entity-id',
        loadChildren: () => import('@xm-ngx/components/by-entity-id').then(m => m.ByEntityIdModule),
    },
    {
        selector: 'by-entity-id-cell',
        loadChildren: () => import('@xm-ngx/components/by-entity-id/by-entity-id-value.component').then(m => m.ByEntityIdValueModule),
    },
    {
        selector: 'text-range-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextRangeControlModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/text-range-control` instead */
        selector: 'text-range',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextRangeControlModule),
    },
    {
        selector: 'text-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextControlModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/text-control` instead */
        selector: 'xm-text-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextControlModule),
    },
    {
        selector: 'table-array',
        loadChildren: () => import('@xm-ngx/components/table/table-array').then(m => m.XmTableArrayModule),
    },
    {
        selector: 'link',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLinkModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/link` instead */
        selector: 'link-value',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLinkModule),
    },
    {
        selector: 'xm-link-view',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLinkViewModule),
    },
    {
        selector: 'xm-link-copy',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLinkViewCopyModule),
    },
    {
        selector: 'link-button',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLinkButtonModule),
    },
    {
        selector: 'html',
        loadChildren: () => import('@xm-ngx/components/html').then(m => m.XmHtmlModule),
    },
    {
        selector: 'innerHTML',
        loadChildren: () => import('@xm-ngx/components/html').then(m => m.InnerHTMLModule),
    },
    {
        selector: 'enum',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/enum` instead */
        selector: 'enum-value',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumModule),
    },

    {
        selector: 'enum-view',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumViewModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/enum-view` instead */
        selector: 'xm-enum-view',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumViewModule),
    },
    {
        selector: 'enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumControlModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/enum-control` instead */
        selector: 'xm-enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumControlModule),
    },
    {
        selector: 'multiple-enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmMultipleEnumControlModule),
    },
    {
        selector: 'icon-enum',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmIconEnumModule),
    },
    {
        selector: 'radio-group-control',
        loadChildren: () => import('@xm-ngx/components/radio-group').then(m => m.XmRadioGroupControlModule),
    },
    {
        selector: 'multi-select',
        loadChildren: () => import('@xm-ngx/components/multi-select/multi-select.component').then(m => m.XmMultiSelectControlModule),
    },
    {
        selector: 'date',
        loadChildren: () => import('@xm-ngx/components/date/xm-date.component').then(m => m.XmDateModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/date` instead */
        selector: 'date-value',
        loadChildren: () => import('@xm-ngx/components/date/xm-date.component').then(m => m.XmDateModule),
    },
    {
        selector: 'date-view',
        loadChildren: () => import('@xm-ngx/components/date/xm-date-view').then(m => m.XmDateViewModule),
    },
    {
        selector: 'date-control',
        loadChildren: () => import('@xm-ngx/components/date/xm-date-control').then(m => m.XmDateControlModule),
    },
    {
        selector: 'date-range-control',
        loadChildren: () => import('@xm-ngx/components/date/xm-date-range-control').then(m => m.XmDateRangeControlModule),
    },
    {
        selector: 'date-range-filter-control',
        loadChildren: () => import('@xm-ngx/components/date/xm-date-range-filter-control').then(m => m.XmDateRangeFilterControlModule),
    },
    {
        selector: 'datetime-control',
        loadChildren: () => import('@xm-ngx/components/date/xm-datetime-control').then(m => m.XmDatetimeControlModule),
    },
    {
        selector: 'string-date-control',
        loadChildren: () => import('@xm-ngx/components/date').then(m => m.XmStringDateControlModule),
    },
    {
        selector: 'navbar-arrow-back-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarArrowBackWidgetModule),
    },
    {
        selector: 'navbar-help-link-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarHelpLinkWidgetModule),
    },
    {
        selector: 'navbar-language-menu-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarLanguageMenuWidgetModule),
    },
    {
        selector: 'navbar-logo-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarLogoWidgetModule),
    },
    {
        selector: 'navbar-search-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarSearchWidgetModule),
    },
    {
        selector: 'navbar-title-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarTitleWidgetModule),
    },
    {
        selector: 'navbar-toggle-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarToggleWidgetModule),
    },
    {
        selector: 'text-title',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextTitleModule),
    },
    {
        selector: 'text-translate',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextTranslateModule),
    },
    {
        selector: 'email-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmEmailControlModule),
    },
    {
        selector: 'password-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmPasswordControlModule),
    },
    {
        selector: 'phone-control',
        loadChildren: () => import('@xm-ngx/components/phone-number-control').then(m => m.XmPhoneNumberControlModule),
    },
    {
        selector: 'text',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/text` instead */
        selector: 'text-value',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextModule),
    },
    {
        selector: 'text-join',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextJoinModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/text-join-value` instead */
        selector: 'text-join-value',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextJoinModule),
    },
    {
        selector: 'text-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextViewModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/text-view` instead */
        selector: 'xm-text-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextViewModule),
    },
    {
        selector: 'text-dynamic-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextDynamicViewModule),
    },
    {
        selector: 'number-control',
        loadChildren: () => import('@xm-ngx/components/number-control').then(m => m.XmNumberControlModule),
    },
    {
        selector: 'numbers-range-control',
        loadChildren: () => import('@xm-ngx/components/numbers-range-control').then(m => m.NumbersRangeControlModule),
    },
    {
        selector: 'xm-ace-editor-control',
        loadChildren: () => import('@xm-ngx/components/ace-editor').then(m => m.XmAceEditorControlModule),
    },
    {
        selector: 'multilanguage',
        loadChildren: () => import('@xm-ngx/components/multilanguage').then(m => m.MultiLanguageModule),
    },
    {
        selector: 'hint-switch',
        loadChildren: () => import('@xm-ngx/components/hint/hint-switch/hint-switch.module').then(m => m.HintSwitchModule),
    },
    {
        selector: 'inline-control',
        loadChildren: () => import('@xm-ngx/components/inline-control/inline-control.component').then(m => m.XmInlineControlComponent),
    },
    {
        selector: 'navbar-dashboard-edit-widget',
        loadChildren: () => import('@xm-ngx/administration/navbar-dashboard-edit-widget').then(m => m.NavbarDashboardEditWidgetModule),
    },
    {
        selector: 'dynamic-list-widget',
        loadChildren: () => import('@xm-ngx/administration/xm-dynamic-list.module').then(m => m.XmDynamicListModule),
    },
];

@NgModule({
    imports: [
        XmDynamicModule.forChild(XM_COMPONENTS_ENTRIES),
    ],
})
export class ComponentsModule {
}
