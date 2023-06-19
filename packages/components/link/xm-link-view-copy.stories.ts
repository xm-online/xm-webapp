import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { XmTextViewModule } from '@xm-ngx/components/text';
import { RouterTestingModule } from '@angular/router/testing';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmLinkViewCopyComponent } from '@xm-ngx/components/link/xm-link-view-copy';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
    title: 'core/link/XmLinkViewCopy',
    component: XmLinkViewCopyComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule, XmTextViewModule,
                RouterTestingModule,
                MatSnackBarModule,
                BrowserAnimationsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule],
        }),
    ],
    argTypes: {
        config: {
            options: ['Option1', 'Option2'],
            control: {type: 'select'},
        },
    },
} as Meta;

const Template: Story<XmLinkViewCopyComponent> = (args: XmLinkViewCopyComponent) => ({
    component: XmLinkViewCopyComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: {id: '123'},
    config: {
        queryParamsFromEntityFields: {'id': 'id'},
        routerLink: ['/'],
        valueField: 'id',
        valueTitle: 'Link',
        valueIcon: 'link',
        title: 'Default',
        styleInline: true,
        icon: 'home',
        copy: {template: '{{value.id}}', copiedMessage: 'Copied'},
    },
};

export const WithStyle = Template.bind({});
WithStyle.args = {
    value: {id: '456'},
    config: {
        queryParamsFromEntityFields: {'id': 'id'},
        routerLink: ['/'],
        valueField: 'id',
        valueTitle: 'Profile',
        valueIcon: 'account_box',
        title: 'Styled',
        styleInline: false,
        icon: 'person',
        copy: {template: '{{value.id}}', copiedMessage: 'Copied'},
    },
};
