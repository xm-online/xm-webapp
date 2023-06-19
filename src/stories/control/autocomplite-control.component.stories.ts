
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EntityCollectionFactoryService } from '@xm-ngx/components/entity-collection';
import { of } from 'rxjs';
import { XmAutocompleteControlComponent } from '@xm-ngx/components/autocomplete-control/autocomplete-control.component';


export default {
    title: 'core/array/XmAutocompleteControl',
    component: XmAutocompleteControlComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatChipsModule,
                MatAutocompleteModule,
                MatIconModule,
                BrowserAnimationsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule,
                HttpClientTestingModule,
            ],
            providers: [
                EntityCollectionFactoryService,
            ],
        }),
    ],
    argTypes: {
        change: { action: 'change' },
    },
} as Meta;

const Template: Story<XmAutocompleteControlComponent> = (args: XmAutocompleteControlComponent) => ({
    component: XmAutocompleteControlComponent,
    props: {
        ...args,
    },
});

export const Default = Template.bind({});
Default.args = {
    list: of([
        { view: { en: 'Item 1' }, value: 'item1' },
        { view: { en: 'Item 2' }, value: 'item2' },
        { view: { en: 'Item 3' }, value: 'item3' },
    ]),
    config: {
        hint: { en: 'Select an option' },
        title: { en: 'Options' },
        placeholder: { en: 'Select...' },
        removable: true,
        onlySuggestSelect: false,
        search: {
            resourceUrl: '/',
            queryParams: { limit: 5 },
            displayFn: '${name}',
            pickKey: 'name',
        },
        autocomplete: ['Option 1', 'Option 2', 'Option 3'],
        ariaLabel: 'array control',
        dataQa: 'array-control',
    },
    control: { value: [], disabled: false, error: null, validator: null },
    items: [],
};
