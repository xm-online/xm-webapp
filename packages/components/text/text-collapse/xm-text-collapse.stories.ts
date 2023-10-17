import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { XmTextCollapseComponent } from '../text-collapse';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';


export default {
    title: 'Core/Presentation/Text/Collapse',
    component: XmTextCollapseComponent,
    decorators: [
        moduleMetadata({
            imports: [
                BrowserAnimationsModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                HintModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),

                MatButtonModule,
                MatIconModule,
                MatMenuModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmTextCollapseComponent> = (args: XmTextCollapseComponent) => ({
    component: XmTextCollapseComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'Example long value',
    config: {},
};

export const CustomMaxWidth = Template.bind({});
CustomMaxWidth.args = {
    value: 'Example long value',
    config: {
        maxWidth: '140px',
    },
};
