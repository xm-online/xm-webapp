import {async, TestBed} from '@angular/core/testing';
import {XmDynamicComponentRegistry} from './xm-dynamic-component-registry.service';
import {XmDynamicModuleRegistry} from './xm-dynamic-module-registry.service';
import {Component, NgModule} from '@angular/core';
import {XM_DYNAMIC_ENTRIES, XM_DYNAMIC_EXTENSIONS} from '../dynamic.injectors';

@Component({selector: 'spec-mock-component', template: ''})
export class MockComponent {
}

@NgModule({
    providers: [
        {
            provide: XM_DYNAMIC_ENTRIES, multi: true, useValue: [
                {selector: 'component-selector', loadChildren: () => Promise.resolve(MockComponent)},
                {selector: 'scope/component-selector', loadChildren: () => Promise.resolve(MockComponent)}
            ]
        },
    ]
})
export class MockExtensionModule {
}

describe('XmDynamicComponentRegistry', () => {
    let dynamicComponentRegistry: XmDynamicComponentRegistry;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: XM_DYNAMIC_EXTENSIONS, multi: true, useValue: [
                        {selector: 'package', loadChildren: () => Promise.resolve(MockExtensionModule)},
                        {selector: '@scope/package', loadChildren: () => Promise.resolve(MockExtensionModule)}
                    ]
                },
                {
                    provide: XM_DYNAMIC_ENTRIES, multi: true, useValue: [
                        {selector: 'global-component-selector', loadChildren: () => Promise.resolve(MockComponent)},
                        {
                            selector: '@scope/global-component-selector',
                            loadChildren: () => Promise.resolve(MockComponent)
                        }
                    ]
                },
                XmDynamicComponentRegistry,
                XmDynamicModuleRegistry,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        dynamicComponentRegistry = TestBed.inject(XmDynamicComponentRegistry);
    });

    it('should be created', () => {
        expect(dynamicComponentRegistry).toBeTruthy();
    });

    it('get global-component-selector', async () => {
        const selector = 'global-component-selector';
        const componentRecord = await dynamicComponentRegistry.find(selector);
        expect(componentRecord.componentType).toEqual(MockComponent);
    });

    it('get @scope/global-component-selector', async () => {
        const selector = '@scope/global-component-selector';
        const componentRecord = await dynamicComponentRegistry.find(selector);
        expect(componentRecord.componentType).toEqual(MockComponent);
    });

    it('get package/component-selector', async () => {
        const selector = 'package/component-selector';
        const componentRecord = await dynamicComponentRegistry.find(selector);
        expect(componentRecord.componentType).toEqual(MockComponent);
    });

    it('get @scope/package/component-selector', async () => {
        const selector = '@scope/package/component-selector';
        const componentRecord = await dynamicComponentRegistry.find(selector);
        expect(componentRecord.componentType).toEqual(MockComponent);
    });

    it('get @scope/package/scope/component-selector', async () => {
        const selector = '@scope/package/scope/component-selector';
        const componentRecord = await dynamicComponentRegistry.find(selector);
        expect(componentRecord.componentType).toEqual(MockComponent);
    });

});
