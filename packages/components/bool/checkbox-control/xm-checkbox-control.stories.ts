import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmCheckboxControl, XmCheckboxControlOptions } from './xm-checkbox-control';

export default {
    title: 'Core/Control/Bool/Checkbox',
    component: XmCheckboxControl,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatButtonModule,
                MatIconModule,
                MatCheckboxModule,
                XmTranslationTestingModule,
                BrowserAnimationsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmCheckboxControl> = (args: XmCheckboxControl) => ({
    component: XmCheckboxControl,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    config: {
        title: 'Example checkbox',
        id: 'checkbox1',
        class: 'example-class',
        cancelable: false,
    } as XmCheckboxControlOptions,
    value: false,
};

export const Cancelable = Template.bind({});
Cancelable.args = {
    config: {
        title: 'Cancelable checkbox',
        id: 'checkbox2',
        class: 'cancelable-class',
        cancelable: true,
    } as XmCheckboxControlOptions,
    value: true,
};
