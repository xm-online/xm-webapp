import { moduleMetadata, StoryObj } from '@storybook/angular';
import { DatePipe } from '@angular/common';
import { XmDateRangeComponent } from './xm-date-range.component';

export default {
    title: 'Core/Presentation/Date/Range',
    component: XmDateRangeComponent,
    decorators: [
        moduleMetadata({
            imports: [XmDateRangeComponent],
            providers: [DatePipe],
        }),
    ],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'For this component use selector <code>@xm-ngx/components/date-range</code>',
            },
        },
    },
};

export const Default: StoryObj<XmDateRangeComponent> = {
    args: {
        config: {
            format: 'yyyy-MM-dd HH:mm:ss',
            separator: '-',
            timezone: 'UTC',
            locale: 'en-US',
        },
        value: { from: new Date(), to: new Date() },
    },
};
