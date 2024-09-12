import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { XmArrayControl, XmArrayControlOptions } from './xm-array-control.component';

export default {
    title: 'Core/Control/Array',
    component: XmArrayControl,
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
        config: {
            control: {type: 'object'},
        },
        searchControl: {
            control: {type: 'object'},
        },
        chipControl: {
            control: {type: 'object'},
        },
    },
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template = (args: XmArrayControl) => ({
    component: XmArrayControl,
    props: {
        ...args,
        filteredItems: of([{ value: 'Item 1', view: 'Item 1' }, { value: 'Item 2', view: 'Item 2' }, { value: 'Item 3', view: 'Item 3' }]), // Mocked observable
        compareSelectedItems: of([{ value: 'Item 1', view: 'Item 1' }]),
    },
});

export const Primary = Template.bind({});
Primary.args = {
    config: {
        hint: { title: {en: 'Enter array items', ua: 'Enter array items'} },
        title:  {en: 'Array Control', ua: 'Array Control'},
        placeholder: {en: 'Add new item', ua: 'Add new item'},
        removable: true,
        onlySuggestSelect: false,
        search: {
            resourceUrl: '/',
            queryParams: {limit: 10},
            displayFn: '${name}',
            pickKey: 'name',
        },
        autocomplete: ['Item 1', 'Item 2', 'Item 3'],
        ariaLabel: 'Array Control',
        dataQa: 'array-control',
    } as XmArrayControlOptions,
};
