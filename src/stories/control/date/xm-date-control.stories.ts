import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { CommonModule } from '@angular/common';
import { HintModule } from '@xm-ngx/components/hint';
import { XmDateControl, XmDateControlOptions } from '@xm-ngx/components/date';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { MatNativeDateModule } from '@angular/material/core';

export default {
    title: 'Core/Control/Date/Default',
    component: XmDateControl,
    decorators: [
        moduleMetadata({
            imports: [
                HintModule,
                CommonModule,
                MatNativeDateModule,
                ReactiveFormsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule,
                ControlErrorModule,
                HintModule,
                BrowserAnimationsModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
};

const Template = (args: XmDateControlOptions) => ({
    component: XmDateControl,
    props: {
        config: args
    },
});

export const Default = Template.bind({});
Default.args = {
    title: 'Default Date',
    name: 'default',
};

export const RequiredDate = Template.bind({});
RequiredDate.args = {
    title: 'Required Date',
    name: 'required',
    required: true,
};

export const DateWithHint = Template.bind({});
DateWithHint.args = {
    title: 'Date with hint',
    name: 'dateHint',
    hint: {text: 'Please enter a date.'},
};

export const NoFutureDates = Template.bind({});
NoFutureDates.args = {
    title: 'Date - no future dates',
    name: 'noFutureDates',
    disableFutureDates: true,
};

export const DateWithUTC = Template.bind({});
DateWithUTC.args = {
    title: 'Date with UTC',
    name: 'dateUTC',
    useUtc: true,
};

export const DateNow = Template.bind({});
DateNow.args = {
    title: 'Date - Now',
    name: 'dateNow',
    dateNow: true,
};
