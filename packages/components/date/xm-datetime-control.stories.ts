import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import {
    XmDateTimeControlComponent,
    XmDateTimeControlConfig,
    XmDateTimeControlFieldComponent
} from '@xm-ngx/components/date/xm-datetime-control';
import { HintModule } from '@xm-ngx/components/hint';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { NgxMaskModule } from 'ngx-mask';

export default {
    title: 'Core/Control/Date/Datetime',
    component: XmDateTimeControlComponent,
    applicationConfig: [
        importProvidersFrom(NgxMaskModule),
    ],
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
                BrowserAnimationsModule,

                XmDateTimeControlFieldComponent,
                MatFormFieldModule,
                MatDatepickerModule,
                MatInputModule,
                MatButtonModule,
                FormsModule,
                MatIconModule,
                NgxMaskModule.forRoot(),
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
};

const Template = (args: XmDateTimeControlConfig) => ({
    component: XmDateTimeControlComponent,
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
