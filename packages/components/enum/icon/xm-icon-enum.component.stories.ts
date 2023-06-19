import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { MatIconModule } from '@angular/material/icon';
import { XmIconEnumComponent } from '@xm-ngx/components/enum';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

export default {
    title: 'core/enum/XmIconEnumComponent',
    component: XmIconEnumComponent,
    decorators: [
        moduleMetadata({
            imports: [MatIconModule,
                BrowserAnimationsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule,],
        }),
    ],
} as Meta;

const Template: Story<XmIconEnumComponent> = (args: XmIconEnumComponent) => ({
    component: XmIconEnumComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'option1',
    config: {
        items: [
            { value: 'option1', icon: 'home' },
            { value: 'option2', icon: 'favorite' },
        ],
    },
};

export const WithCustomIcons = Template.bind({});
WithCustomIcons.args = {
    value: 'option2',
    config: {
        items: [
            { value: 'option1', icon: 'drive_eta' },
            { value: 'option2', icon: 'sports_soccer' },
        ],
    },
};
