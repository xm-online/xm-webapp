// DateRangeFilterControl.stories.ts

import { moduleMetadata } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateRangeFilterControl, XmDateComponent } from '@xm-ngx/components/date/index';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


export default {
    title: 'Core/Control/Date/Range filter',
    component: DateRangeFilterControl,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                FormsModule,
                BrowserAnimationsModule,
                OwlNativeDateTimeModule,
                ReactiveFormsModule,
                OwlDateTimeModule,
                MatNativeDateModule,
                XmDateComponent,
                XmTranslationTestingModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
            ],

        }),
    ],
    parameters: {
        layout: 'centered',
    },
};

// Define the template to be used in the story
const Template = (args: DateRangeFilterControl) => ({
    component: DateRangeFilterControl,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    config: {
        title: 'Date Range',
    },
};
