import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';
import { HintModule } from '@xm-ngx/components/hint';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { XmDateRangeControl, XmDateValue } from '@xm-ngx/components/date';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { MatNativeDateModule } from '@angular/material/core';
export default {
    title: 'Core/Control/Date/Range Control',
    component: XmDateRangeControl,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatDatepickerModule,
                MatInputModule,
                MatButtonModule,
                MatIconModule,
                XmTranslationModule,
                ControlErrorModule,
                HintModule,
                BrowserAnimationsModule,
                XmTranslationTestingModule,
                MatNativeDateModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
};

const Template = (args: { component: XmDateRangeControl, props: any }) => ({
    component: XmDateRangeControl,
    props: {
        config: args,
        startDateChange: (event: MatDatepickerInputEvent<XmDateValue>) => {
            args.props.value.from = event.value;
        },
        endDateChange: (event: MatDatepickerInputEvent<XmDateValue>) => {
            args.props.value.to = event.value;
        },
    },
});

export const Default = Template.bind({});
Default.args = {
    title: 'Default Date Range',
    fromName: 'startDate',
    toName: 'endDate',
    format: 'y-MM-dd',
    value: {
        from: null,
        to: null,
    } as any,
};


export const DateRangeWithTransform = Template.bind({});
DateRangeWithTransform.args = {
    title: 'Date Range with transform',
    fromName: 'startDate',
    toName: 'endDate',
    format: 'y-MM-dThh:mm:ss',
    message: 'message',
    transform: {
        quotes: ['/', '-'],
        separator: 'to',
    },
    value: {
        from: null,
        to: null,
    } as any,

};

export const DateRangeWithFormat = Template.bind({});
DateRangeWithFormat.args = {
    title: 'Date Range with format',
    fromName: 'startDate',
    toName: 'endDate',
    format: 'y-MM-dT hh:mm:ss',
    transform: {
        quotes: ['"', '"'],
        separator: 'to',
    },
    value: {
        from: null,
        to: null,
    } as any,
};
