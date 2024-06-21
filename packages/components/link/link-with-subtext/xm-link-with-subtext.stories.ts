import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { LinkWithSubtextComponent } from './xm-link-with-subtext.component';
import { XmLinkValueFormat } from '../xm-link.model';
import { XmLink } from '../xm-link';
import { DatePipe } from '@angular/common';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { RouterTestingModule } from '@angular/router/testing';
import { XmDateComponent } from '@xm-ngx/components/date';

const meta: Meta<LinkWithSubtextComponent> = {
    title: 'Core/Presentation/Link',
    component: LinkWithSubtextComponent,
    decorators: [
        moduleMetadata({
            imports: [
                XmLink,
                XmDateComponent,
                XmDynamicExtensionModule.forRoot([]),
                XmDynamicModule.forRoot([
                    {
                        selector: '@xm-ngx/components/date',
                        loadChildren: () => import('@xm-ngx/components/date').then(m => m.XmDateComponent),
                    },
                ].concat()),
                RouterTestingModule,
            ],
            providers: [
                DatePipe,
            ],
        }),
    ],
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};
export default meta;
type Story = StoryObj<LinkWithSubtextComponent>

export const LinkWithSubtext: Story = {
    args: {
        value: {
            date: '2024-06-18T09:29:51.331Z',
            id: 'some-unique-id',
        },
        config: {
            linkConfig: {
                valueField: 'date',
                routerLink: 'your-slug-to-the-page',
                format: {
                    type: XmLinkValueFormat.DATE,
                    pattern: 'dd.MM.yyyy',
                },
                valueTitle: '',
                valueIcon: '',
            },
            subtext: {
                field: 'date',
                selector: '@xm-ngx/components/date',
                config: {
                    format: 'HH:mm:ss',
                },
            },
        },
    },
};
