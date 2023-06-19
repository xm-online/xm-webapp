import { Meta, Story } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import { moduleMetadata } from '@storybook/angular';
import { XmTextViewModule } from '@xm-ngx/components/text';
import { RouterTestingModule } from '@angular/router/testing';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmLinkViewComponent } from '@xm-ngx/components/link/xm-link-view';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
    title: 'core/link/XmLinkView',
    component: XmLinkViewComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule, XmTextViewModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule],
        }),
    ],
    argTypes: {
        config: {
            options: ['Option1', 'Option2'],
            control: { type: 'select' }
        }
    }
} as Meta;

const Template: Story<XmLinkViewComponent> = (args: XmLinkViewComponent) => ({
    component: XmLinkViewComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: {id: '123'},
    config: {
        queryParamsFromEntityFields: {'id': 'id'},
        routerLink: ['/home'],
        valueField: 'id',
        valueTitle: 'Link',
        valueIcon: 'link',
        title: 'Default',
        styleInline: true,
        icon: 'home'
    }
};

export const WithStyle = Template.bind({});
WithStyle.args = {
    value: {id: '456'},
    config: {
        queryParamsFromEntityFields: {'id': 'id'},
        routerLink: ['/profile'],
        valueField: 'id',
        valueTitle: 'Profile',
        valueIcon: 'account_box',
        title: 'Styled',
        styleInline: false,
        icon: 'person'
    }
};
