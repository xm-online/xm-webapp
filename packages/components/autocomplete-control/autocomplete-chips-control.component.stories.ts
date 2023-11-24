import { Meta, moduleMetadata, applicationConfig } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { Observable, of } from 'rxjs';
import { Component, Input, OnInit, importProvidersFrom } from '@angular/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { XmCoreModule } from '@xm-ngx/core';
import { XmLoggerModule } from '@xm-ngx/logger';
import { XmCoreConfigModule } from '@xm-ngx/core/config';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { XmTranslationModule } from '@xm-ngx/translation';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmAutocompleteControlConfig } from '@xm-ngx/components/autocomplete-control';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmAutocompleteChipsControlComponent } from '@xm-ngx/components/autocomplete-control';

function StaticLoaderFactory() {
    return of(require('src/i18n/en.json'));
}

class MockHttpSearch {
    public request(
        resourceMethod,
        httpBody,
        httpParams,
        headers,
    ): Observable<unknown> {
        const search = (httpParams?.search ?? '').toLowerCase();

        let data = [
            { name: 'Option 1', id: 1 },
            { name: 'Option 2', id: 2 },
            { name: 'Option 3', id: 3 },
        ];

        if (search.length > 0) {
            data = data.filter(d => d.name.toLowerCase().includes(search));
        }

        return of(data);
    }
}

class MockHttpSearchWrapInObject {
    public request(
        resourceMethod,
        httpBody,
        httpParams,
        headers,
    ): Observable<unknown> {
        const search = (httpParams?.search ?? '').toLowerCase();

        let data = [
            { name: 'Option 1', id: 1 },
            { name: 'Option 2', id: 2 },
            { name: 'Option 3', id: 3 },
        ];

        if (search.length > 0) {
            data = data.filter(d => d.name.toLowerCase().includes(search));
        }

        return of({
            wraps: data,
        });
    }
}

function mockHttpAutocompleteControlFactory(): { create: (resourceUrl: string) => MockHttpSearch } {
    return {
        create: (resoureUrl) => resoureUrl === 'wrapInObject' ? new MockHttpSearchWrapInObject() : new MockHttpSearch(),
    };
}

@Component({
    standalone: true,
    selector: 'demo-autocomplete-form',
    imports: [
        ReactiveFormsModule,
        XmAutocompleteChipsControlComponent,
    ],
    template: `
        <div [formGroup]="form">
            <xm-autocomplete-chips-control formControlName="auto" [config]="config"></xm-autocomplete-chips-control>
        </div>
    `,
})
class DemoAutocompleteFormComponent implements OnInit {
    @Input() public config: XmAutocompleteControlConfig;
    @Input() public selected: object;

    public form: FormGroup;

    public ngOnInit(): void {
        this.form = new FormGroup({
            auto: new FormControl(this.selected),
        });
    }
}

type DemoAutocompleteControlArgs = { config: XmAutocompleteControlConfig, selected?: object };

export default {
    title: 'Core/Control/Autocomplete/Chips',
    component: DemoAutocompleteFormComponent,
    decorators: [
        applicationConfig({
            providers: [
                importProvidersFrom(NgxWebstorageModule.forRoot()),
                importProvidersFrom(XmCoreModule.forRoot()),
                importProvidersFrom(XmLoggerModule.forRoot()),
                importProvidersFrom(XmCoreConfigModule),
                importProvidersFrom(HttpClientModule),
                importProvidersFrom(BrowserAnimationsModule),
                importProvidersFrom(TranslateModule.forRoot({
                    isolate: false,
                    loader: {
                        deps: [HttpClient],
                        provide: TranslateLoader,
                        useFactory: StaticLoaderFactory,
                    },
                })),
            ],
        }),
        moduleMetadata({
            imports: [
                CommonModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot(),
                XmTranslationModule.forRoot(),
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmDynamicExtensionModule.forRoot([]),
                XmDynamicModule.forRoot([]),
            ],
            providers: [
                {
                    provide: EntityCollectionFactoryService,
                    useFactory: mockHttpAutocompleteControlFactory,
                },
            ],
        }),
    ],
    argTypes: {
        change: { action: 'change' },
    },
} as Meta;

const simpleMultipleAutocompleteTemplate = (args: DemoAutocompleteControlArgs) => ({
    props: {
        ...args,
    },
});

export const SimpleMultipleAutocomplete = simpleMultipleAutocompleteTemplate.bind({});

SimpleMultipleAutocomplete.args = {
    config: {
        hint: {
            title: { en: 'Select an option' },
        },
        title: {
            en: 'Options',
        },
        placeholder: {
            en: 'Select...',
        },
        multiple: true,
        // Mocks
        search: {
            resourceUrl: 'search',
            resourceMethod: 'GET',
            queryParams: {
                // Keys depends what is your need for backend
                search: '{{entity.search}}',
            },
            body: {},
            headers: {},
        },
        searchPlaceholder: 'Search',
        notFoundSearchPlaceholder: 'Not found',
        itemMapper: {
            displayFn: '${name}',
            valueByKey: '${id}',
        },
    } as Partial<XmAutocompleteControlConfig>,
};
