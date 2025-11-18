// import { Meta, moduleMetadata, applicationConfig } from '@storybook/angular';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { EntityCollectionFactoryService } from '@xm-ngx/repositories';
// import { Observable, of } from 'rxjs';
// import { XmAutocompleteControlComponent } from '@xm-ngx/components/autocomplete-control';
// import { Component, Input, OnInit, importProvidersFrom } from '@angular/core';
// import { NgxWebstorageModule } from 'ngx-webstorage';
// import { XmCoreModule } from '@xm-ngx/core';
// import { XmLoggerModule } from '@xm-ngx/logger';
// import { XmCoreConfigModule } from '@xm-ngx/core/config';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { CommonModule } from '@angular/common';
// import { XmTranslationModule } from '@xm-ngx/translation';
// import { ControlErrorModule } from '@xm-ngx/components/control-error';
// import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
// import { XmAutocompleteControlConfig } from '@xm-ngx/components/autocomplete-control';
// import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { XmCoreAuthModule } from '@xm-ngx/core/auth';
//TODO: Solve problem circular dependency
// import { XmSharedModule } from '@xm-ngx/shared';
//
// function StaticLoaderFactory() {
//     return of(require('src/i18n/en.json'));
// }
//
// class MockHttpSearch {
//     public request(
//         resourceMethod,
//         httpBody,
//         httpParams,
//         headers,
//     ): Observable<unknown> {
//         const search = (httpParams?.search ?? '').toLowerCase();
//
//         let data = [
//             {name: 'Option 1', id: 1},
//             {name: 'Option 2', id: 2},
//             {name: 'Option 3', id: 3},
//         ];
//
//         if (search.length > 0) {
//             data = data.filter(d => d.name.toLowerCase().includes(search));
//         }
//
//         return of(data);
//     }
// }
//
// class MockHttpSearchWrapInObject {
//     public request(
//         resourceMethod,
//         httpBody,
//         httpParams,
//         headers,
//     ): Observable<unknown> {
//         const search = (httpParams?.search ?? '').toLowerCase();
//
//         let data = [
//             {name: 'Option 1', id: 1},
//             {name: 'Option 2', id: 2},
//             {name: 'Option 3', id: 3},
//         ];
//
//         if (search.length > 0) {
//             data = data.filter(d => d.name.toLowerCase().includes(search));
//         }
//
//         return of({
//             wraps: data,
//         });
//     }
// }
//
// function mockHttpAutocompleteControlFactory(): { create: (resourceUrl: string) => MockHttpSearch } {
//     return {
//         create: (resoureUrl) => resoureUrl === 'wrapInObject' ? new MockHttpSearchWrapInObject() : new MockHttpSearch(),
//     };
// }
//
// @Component({
//     standalone: true,
//     selector: 'demo-autocomplete-form',
//     imports: [
//         ReactiveFormsModule,
//         XmAutocompleteControlComponent,
//     ],
//     template: `
//         <div [formGroup]="form">
//             <xm-autocomplete-control formControlName="auto" [config]="config"></xm-autocomplete-control>
//         </div>
//     `,
// })
// class DemoAutocompleteFormComponent implements OnInit {
//     @Input() public config: XmAutocompleteControlConfig;
//     @Input() public selected: object;
//
//     public form: FormGroup;
//
//     public ngOnInit(): void {
//         this.form = new FormGroup({
//             auto: new FormControl(this.selected),
//         });
//     }
// }
//
// type DemoAutocompleteControlArgs = { config: XmAutocompleteControlConfig, selected?: object };
//
// export default {
//     title: 'Core/Control/Autocomplete/Select',
//     component: DemoAutocompleteFormComponent,
//     decorators: [
//         applicationConfig({
//             providers: [
//                 importProvidersFrom(NgxWebstorageModule.forRoot()),
//                 importProvidersFrom(XmSharedModule.forRoot()),
//                 importProvidersFrom(XmCoreModule.forRoot()),
//                 importProvidersFrom(XmCoreAuthModule.forRoot()),
//                 importProvidersFrom(XmLoggerModule.forRoot()),
//                 importProvidersFrom(XmCoreConfigModule),
//                 importProvidersFrom(HttpClientModule),
//                 importProvidersFrom(BrowserAnimationsModule),
//                 importProvidersFrom(TranslateModule.forRoot({
//                     isolate: false,
//                     loader: {
//                         deps: [HttpClient],
//                         provide: TranslateLoader,
//                         useFactory: StaticLoaderFactory,
//                     },
//                 })),
//             ],
//         }),
//         moduleMetadata({
//             imports: [
//                 CommonModule,
//                 BrowserAnimationsModule,
//                 TranslateModule.forRoot(),
//                 XmTranslationModule.forRoot(),
//                 ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
//             ],
//             providers: [
//                 {
//                     provide: EntityCollectionFactoryService,
//                     useFactory: mockHttpAutocompleteControlFactory,
//                 },
//             ],
//         }),
//     ],
//     argTypes: {
//         change: {action: 'change'},
//     },
// } as Meta;
//
// const simpleAutocompleteTemplate = (args: DemoAutocompleteControlArgs) => ({
//     props: {
//         ...args,
//     },
// });
//
// export const SimpleAutocomplete = simpleAutocompleteTemplate.bind({});
//
// SimpleAutocomplete.args = {
//     config: {
//         hint: {
//             title: {en: 'Select an option'},
//         },
//         title: {
//             en: 'Options',
//         },
//         placeholder: {
//             en: 'Select...',
//         },
//         // Mocks
//         search: {
//             resourceUrl: 'search',
//             resourceMethod: 'GET',
//             queryParams: {
//                 // Keys depends what is your need for backend
//                 search: '{{entity.search}}',
//             },
//             body: {},
//             headers: {},
//         },
//         searchPlaceholder: 'Search',
//         notFoundSearchPlaceholder: 'Not found',
//         itemMapper: {
//             displayFn: '${name}',
//             valueByKey: '${id}',
//         },
//     } as Partial<XmAutocompleteControlConfig>,
// };
//
// const simpleMultipleAutocompleteTemplate = (args: DemoAutocompleteControlArgs) => ({
//     props: {
//         ...args,
//     },
// });
//
// export const SimpleMultipleAutocomplete = simpleMultipleAutocompleteTemplate.bind({});
//
// SimpleMultipleAutocomplete.args = {
//     config: {
//         hint: {
//             title: {en: 'Select an option'},
//         },
//         title: {
//             en: 'Options',
//         },
//         placeholder: {
//             en: 'Select...',
//         },
//         multiple: true,
//         // Mocks
//         search: {
//             resourceUrl: 'search',
//             resourceMethod: 'GET',
//             queryParams: {
//                 // Keys depends what is your need for backend
//                 search: '{{entity.search}}',
//             },
//             body: {},
//             headers: {},
//         },
//         searchPlaceholder: 'Search',
//         notFoundSearchPlaceholder: 'Not found',
//         itemMapper: {
//             displayFn: '${name}',
//             valueByKey: '${id}',
//         },
//     } as Partial<XmAutocompleteControlConfig>,
// };
//
//
// const valueAsObjectAutocompleteTemplate = (args: DemoAutocompleteControlArgs) => ({
//     props: {
//         ...args,
//     },
// });
//
// export const ValueAsObjectAutocomplete = valueAsObjectAutocompleteTemplate.bind({});
//
// ValueAsObjectAutocomplete.args = {
//     config: {
//         hint: {
//             title: {en: 'Select an option'},
//         },
//         title: {
//             en: 'Options',
//         },
//         placeholder: {
//             en: 'Select...',
//         },
//         // Mocks
//         search: {
//             resourceUrl: 'search',
//             resourceMethod: 'GET',
//             queryParams: {
//                 // Keys depends what is your need for backend
//                 search: '{{entity.search}}',
//             },
//             body: {},
//             headers: {},
//         },
//         searchPlaceholder: 'Search',
//         notFoundSearchPlaceholder: 'Not found',
//         valueAsJson: true,
//         itemMapper: {
//             displayFn: '${name}',
//             valueByKey: {
//                 id: '${id}',
//                 name: '${name}',
//             },
//         },
//     } as Partial<XmAutocompleteControlConfig>,
// };
//
// const startFromCharSearchAutocompleteTemplate = (args: DemoAutocompleteControlArgs) => ({
//     props: {
//         ...args,
//     },
// });
//
// export const startFromCharSearchAutocomplete = startFromCharSearchAutocompleteTemplate.bind({});
//
// startFromCharSearchAutocomplete.args = {
//     config: {
//         hint: {
//             title: {en: 'Select an option'},
//         },
//         title: {
//             en: 'Options',
//         },
//         placeholder: {
//             en: 'Select...',
//         },
//         // Mocks
//         search: {
//             resourceUrl: 'search',
//             resourceMethod: 'GET',
//             queryParams: {
//                 // Keys depends what is your need for backend
//                 search: '{{entity.search}}',
//             },
//             body: {},
//             headers: {},
//         },
//         searchPlaceholder: 'Search',
//         notFoundSearchPlaceholder: 'Not found',
//         valueAsJson: true,
//         startFromCharSearch: 3,
//         itemMapper: {
//             displayFn: '${name}',
//             valueByKey: {
//                 id: '${id}',
//                 name: '${name}',
//             },
//         },
//     } as Partial<XmAutocompleteControlConfig>,
// };
//
//
// const whenBackendWrapsDataInObjectAutocompleteTemplate = (args: DemoAutocompleteControlArgs) => ({
//     props: {
//         ...args,
//     },
// });
//
// export const whenBackendWrapsDataInObjectAutocomplete = whenBackendWrapsDataInObjectAutocompleteTemplate.bind({});
//
// whenBackendWrapsDataInObjectAutocomplete.args = {
//     config: {
//         hint: {
//             title: {en: 'Select an option'},
//         },
//         title: {
//             en: 'Options',
//         },
//         placeholder: {
//             en: 'Select...',
//         },
//         // Mocks
//         search: {
//             resourceUrl: 'wrapInObject',
//             resourceMethod: 'GET',
//             queryParams: {
//                 // Keys depends what is your need for backend
//                 search: '{{entity.search}}',
//             },
//             body: {},
//             headers: {},
//         },
//         searchPlaceholder: 'Search',
//         notFoundSearchPlaceholder: 'Not found',
//         valueAsJson: true,
//         extractByKey: 'wraps',
//         startFromCharSearch: 3,
//         itemMapper: {
//             displayFn: '${name}',
//             valueByKey: {
//                 id: '${id}',
//                 name: '${name}',
//             },
//         },
//     } as Partial<XmAutocompleteControlConfig>,
// };
//
// const compareObjectInAutocompleteTemplate = (args: DemoAutocompleteControlArgs) => ({
//     props: {
//         ...args,
//     },
// });
//
// export const compareObjectInAutocomplete = compareObjectInAutocompleteTemplate.bind({});
//
// compareObjectInAutocomplete.args = {
//     selected: {name: 'Option 2', id: 2},
//     config: {
//         hint: {
//             title: {en: 'Select an option'},
//         },
//         title: {
//             en: 'Options',
//         },
//         placeholder: {
//             en: 'Select...',
//         },
//         // Mocks
//         search: {
//             resourceUrl: 'search',
//             resourceMethod: 'GET',
//             queryParams: {
//                 // Keys depends what is your need for backend
//                 search: '{{entity.search}}',
//             },
//             body: {},
//             headers: {},
//         },
//         valueAsJson: true,
//         searchPlaceholder: 'Search',
//         notFoundSearchPlaceholder: 'Not found',
//         // Without this option the value will not be selected in the form
//         compareMap: {
//             id: '{{entity.id}}',
//         },
//         itemMapper: {
//             displayFn: '${name}',
//             valueByKey: {
//                 id: '${id}',
//                 name: '${name}',
//             },
//         },
//     } as Partial<XmAutocompleteControlConfig>,
// };
