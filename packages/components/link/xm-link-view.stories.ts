import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { XmLink, XmLinkViewComponent } from '../link';
import { XmTextViewModule } from '@xm-ngx/components/text';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';


export default {
    title: 'Core/Presentation/Link/View',
    component: XmLinkViewComponent,
    decorators: [
        moduleMetadata({
            imports: [
                BrowserAnimationsModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                HintModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),

                CommonModule,
                XmTextViewModule,
                RouterTestingModule,
                MatIconModule,
                XmLink,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template = (args: XmLinkViewComponent) => ({
    component: XmLinkViewComponent,
    props: args,
});

const entity = {
    id: '12345',
    name: 'John',
    data: {
        country: 'UA',
    },
};

export const Default = Template.bind({});
Default.args = {
    value: entity,
    config: {
        title: 'Title',
        valueField: 'name',
    },
};

export const WithIcon = Template.bind({});
WithIcon.args = {
    value: entity,
    config: {
        title: 'Title',
        valueField: 'name',
        icon: 'person',
    },
};

export const WithFieldTitle = Template.bind({});
WithFieldTitle.args = {
    value: entity,
    config: {
        title: 'Title',
        valueField: 'name',
        valueTitle: 'Value title:',
    },
};
