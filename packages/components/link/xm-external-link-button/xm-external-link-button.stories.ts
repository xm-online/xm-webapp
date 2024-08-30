import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { XmExternalLinkButtonComponent } from './xm-external-link-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

const meta: Meta<XmExternalLinkButtonComponent> = {
    title: 'Core/Presentation/Link',
    component: XmExternalLinkButtonComponent,
    decorators: [
        moduleMetadata({
            imports: [
                XmTranslationTestingModule,
                MatButtonModule,
                MatIconModule,
            ],

        }),
    ],
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};
export default meta;
type Story = StoryObj<XmExternalLinkButtonComponent>;

/**
 * External link button in case you have to open the same link for the different languages.
 */
export const ExternalLinkButton: Story = {
    args: {
        config: {
            link: 'https://google.com',
            title: {
                en: 'Google',
                uk: 'Гугл',
            },
        },
    },
};

/**
 * External link button in case you have to open the specific link for the specific language.
 */
export const ExternalLinkButtonLocalized: Story = {
    args: {
        config: {
            link: {
                en: 'https://google.com',
                uk: 'https://google.com.ua',
            },
            title: {
                en: 'Google',
                uk: 'Гугл',
            },
        },
    },
};


/**
 * External link button in case you want to change default icon and target behaviour.
 *
 * 💡HINT: ***If you change the icon, probably you should change the target as well. Because the most appropriate icon is `open_in_new` for `_blank` target***.
 *
 */
export const ExternalLinkButtonOtherParams: Story = {
    args: {
        config: {
            link: 'https://google.com',
            title: {
                en: 'Google',
                uk: 'Гугл',
            },
            icon: 'open_in_browser',
            target: '_self',
        },
    },
};

