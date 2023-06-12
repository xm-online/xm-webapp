import { Meta, Story, moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { XmTextCellComponent, XmTextCellConfig } from '@xm-ngx/components/text/text-cell/text-cell.component';

export default {
    title: 'core/text/XmTextCellComponent',
    component: XmTextCellComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                RouterTestingModule, // Add routes if required
                MatButtonModule,
                MatIconModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule,
                BrowserAnimationsModule, // Required for Angular Material
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmTextCellComponent> = (args: XmTextCellComponent) => ({
    component: XmTextCellComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'Some value',
    config: {
        transformQueryParams: { id: 'id' },
        routerLink: '/some-link',
    } as XmTextCellConfig,
};
