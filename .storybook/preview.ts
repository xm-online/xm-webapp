import type { Preview } from "@storybook/angular";
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";

setCompodocJson(docJson);

const preview: Preview = {
    globalTypes: {
        locale: {
            right: 'true',
            description: 'Internationalization locale',
            defaultValue: 'en',
            toolbar: {
                icon: 'globe',
                items: [
                    {value: 'en', right: '🇺🇸', title: 'English'},
                    {value: 'ua', right: 'ua', title: 'UA'},
                ],
            },
        },
    },
    parameters: {
        actions: {argTypesRegex: "^on[A-Z].*"},
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
};


export default preview;
